#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { DateInfoEngine } from './engines/dateInfoEngine.js';
import { DateUtils } from './utils/dateUtils.js';
import { Validator } from './utils/validator.js';
import { ErrorHandler, ValidationError, DateParseError } from './utils/errorHandler.js';

/**
 * 中国农历节日转换MCP服务
 */
class SinoCalendarMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'sino-calendar-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  /**
   * 设置工具处理器
   */
  private setupToolHandlers(): void {
    // 注册工具列表
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_date_info',
            description: '获取指定日期的完整信息，包括农历、节日、24节气、工作日类型等',
            inputSchema: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  description: '日期，格式为YYYY-MM-DD，如：2025-01-01',
                  pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                },
              },
              required: ['date'],
            },
          },
          {
            name: 'get_date_range_info',
            description: '获取指定日期范围内所有日期的信息',
            inputSchema: {
              type: 'object',
              properties: {
                startDate: {
                  type: 'string',
                  description: '开始日期，格式为YYYY-MM-DD',
                  pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                },
                endDate: {
                  type: 'string',
                  description: '结束日期，格式为YYYY-MM-DD',
                  pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                },
              },
              required: ['startDate', 'endDate'],
            },
          },
        ] as Tool[],
      };
    });

    // 注册工具调用处理器
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      // 记录操作日志
      ErrorHandler.logOperation(name, args);

      try {
        // 验证工具参数
        const validation = Validator.validateToolArgs(name, args);
        ErrorHandler.validateAndThrow(validation);

        // 检查系统限制
        ErrorHandler.checkSystemLimits(name, args);

        switch (name) {
          case 'get_date_info':
            return await this.handleGetDateInfo(args);

          case 'get_date_range_info':
            return await this.handleGetDateRangeInfo(args);

          default:
            throw new ValidationError(`未知的工具: ${name}`);
        }
      } catch (error) {
        return ErrorHandler.handleError(error);
      }
    });
  }

  /**
   * 处理获取单个日期信息的请求
   */
  private async handleGetDateInfo(args: any) {
    const date = DateUtils.parseDate(args.date);
    if (!date) {
      throw new DateParseError('无法解析日期');
    }

    // 获取日期信息
    const dateInfo = DateInfoEngine.getDateInfo(date);

    // 记录成功操作
    ErrorHandler.logOperation('get_date_info', args, dateInfo);

    return ErrorHandler.createSuccessResponse(dateInfo);
  }

  /**
   * 处理获取日期范围信息的请求
   */
  private async handleGetDateRangeInfo(args: any) {
    const startDate = DateUtils.parseDate(args.startDate);
    const endDate = DateUtils.parseDate(args.endDate);

    if (!startDate || !endDate) {
      throw new DateParseError('无法解析日期');
    }

    // 获取日期范围信息
    const rangeInfo = DateInfoEngine.getDateRangeInfo(startDate, endDate);

    // 记录成功操作
    ErrorHandler.logOperation('get_date_range_info', args, { count: rangeInfo.dates.length });

    return ErrorHandler.createSuccessResponse(rangeInfo);
  }

  /**
   * 设置错误处理
   */
  private setupErrorHandling(): void {
    this.server.onerror = error => {
      console.error('[MCP Server Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * 启动服务器
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('中国农历节日转换MCP服务已启动');
  }
}

// 启动服务器
async function main() {
  const server = new SinoCalendarMCPServer();
  await server.start();
}

// 如果直接运行此文件，则启动服务器
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('启动服务器失败:', error);
    process.exit(1);
  });
}

export { SinoCalendarMCPServer };
