#!/usr/bin/env node
/**
 * 中国农历节日转换MCP服务
 */
declare class SinoCalendarMCPServer {
    private server;
    constructor();
    /**
     * 设置工具处理器
     */
    private setupToolHandlers;
    /**
     * 处理获取单个日期信息的请求
     */
    private handleGetDateInfo;
    /**
     * 处理获取日期范围信息的请求
     */
    private handleGetDateRangeInfo;
    /**
     * 设置错误处理
     */
    private setupErrorHandling;
    /**
     * 启动服务器
     */
    start(): Promise<void>;
}
export { SinoCalendarMCPServer };
