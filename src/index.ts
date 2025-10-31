#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { DateInfoEngine } from './engines/dateInfoEngine.js';
import { ReverseQueryEngine } from './engines/reverseQueryEngine.js';
import { DateUtils } from './utils/dateUtils.js';
import { Validator } from './utils/validator.js';
import { DateParseError, ErrorHandler, ValidationError } from './utils/errorHandler.js';

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
          {
            name: 'reverse_query_by_name',
            description: '通过农历日期、节日名称、节气名称反向查询公历日期',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: '查询内容：农历日期（如：农历2025年正月初一）、节日名称（如：春节）、节气名称（如：立春）',
                },
                type: {
                  type: 'string',
                  description: '查询类型：lunar（农历）| festival（节日）| solar_term（节气）',
                  enum: ['lunar', 'festival', 'solar_term'],
                },
                year: {
                  type: 'number',
                  description: '指定查询年份（可选，不指定则查询前后5年）',
                  minimum: 1900,
                  maximum: 2100,
                },
              },
              required: ['query', 'type'],
            },
          },
          {
            name: 'query_by_date_range',
            description: '在指定日期范围内查询符合条件的日期（休息日、工作日、节日、节气）',
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
                type: {
                  type: 'string',
                  description: '查询类型：rest_days（休息日）| work_days（工作日）| festivals（节日）| solar_terms（节气）',
                  enum: ['rest_days', 'work_days', 'festivals', 'solar_terms'],
                },
              },
              required: ['startDate', 'endDate', 'type'],
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

          case 'reverse_query_by_name':
            return await this.handleReverseQueryByName(args);

          case 'query_by_date_range':
            return await this.handleQueryByDateRange(args);

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
   * 处理反向查询请求
   */
  private async handleReverseQueryByName(args: any) {
    const { query, type, year } = args;
    
    // 确定年份范围
    let yearRange: number[];
    if (year) {
      yearRange = [year];
    } else {
      const currentYear = new Date().getFullYear();
      yearRange = [];
      for (let i = -5; i <= 5; i++) {
        yearRange.push(currentYear + i);
      }
    }

    let results: any[] = [];

    try {
      switch (type) {
        case 'lunar':
          results = ReverseQueryEngine.queryLunarDate(query, yearRange);
          break;
        case 'festival':
          results = ReverseQueryEngine.queryFestival(query, yearRange);
          break;
        case 'solar_term':
          results = ReverseQueryEngine.querySolarTerm(query, yearRange);
          break;
        default:
          throw new ValidationError(`不支持的查询类型: ${type}`);
      }

      // 记录成功操作
      ErrorHandler.logOperation('reverse_query_by_name', args, { count: results.length });

      return ErrorHandler.createSuccessResponse({ dates: results });
    } catch (error) {
      throw new ValidationError(`反向查询失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 处理日期范围条件查询请求
   */
  private async handleQueryByDateRange(args: any) {
    const { startDate, endDate, type } = args;

    try {
      const results = ReverseQueryEngine.queryByDateRange(startDate, endDate, type);

      // 记录成功操作
      ErrorHandler.logOperation('query_by_date_range', args, { count: results.length });

      return ErrorHandler.createSuccessResponse({ dates: results });
    } catch (error) {
      throw new ValidationError(`日期范围查询失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
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
