/**
 * 自定义错误类型
 */
export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare class DateParseError extends Error {
    constructor(message: string);
}
export declare class DateRangeError extends Error {
    constructor(message: string);
}
export declare class ToolNotFoundError extends Error {
    constructor(toolName: string);
}
/**
 * 错误处理工具类
 */
export declare class ErrorHandler {
    /**
     * 处理错误并返回标准化的错误响应
     * @param error 错误对象
     * @returns 标准化的错误响应
     */
    static handleError(error: unknown): {
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    };
    /**
     * 安全执行函数，自动处理错误
     * @param fn 要执行的函数
     * @returns 执行结果或错误响应
     */
    static safeExecute<T>(fn: () => T | Promise<T>): Promise<{
        success: boolean;
        data: Awaited<T>;
        error?: undefined;
    } | {
        success: boolean;
        error: {
            content: {
                type: string;
                text: string;
            }[];
            isError: boolean;
        };
        data?: undefined;
    }>;
    /**
     * 验证并抛出相应的错误
     * @param validation 验证结果
     */
    static validateAndThrow(validation: {
        isValid: boolean;
        error?: string;
    }): void;
    /**
     * 创建标准成功响应
     * @param data 响应数据
     * @returns 标准成功响应
     */
    static createSuccessResponse(data: any): {
        content: {
            type: string;
            text: string;
        }[];
    };
    /**
     * 记录操作日志
     * @param operation 操作名称
     * @param params 操作参数
     * @param result 操作结果
     */
    static logOperation(operation: string, params: any, result?: any): void;
    /**
     * 检查系统资源和限制
     * @param operation 操作类型
     * @param params 操作参数
     */
    static checkSystemLimits(operation: string, params: any): void;
    /**
     * 格式化错误信息为用户友好的格式
     * @param error 错误对象
     * @returns 用户友好的错误信息
     */
    static formatUserFriendlyError(error: unknown): string;
}
