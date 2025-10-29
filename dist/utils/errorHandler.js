/**
 * 自定义错误类型
 */
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
export class DateParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DateParseError';
    }
}
export class DateRangeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DateRangeError';
    }
}
export class ToolNotFoundError extends Error {
    constructor(toolName) {
        super(`未知的工具: ${toolName}`);
        this.name = 'ToolNotFoundError';
    }
}
/**
 * 错误处理工具类
 */
export class ErrorHandler {
    /**
     * 处理错误并返回标准化的错误响应
     * @param error 错误对象
     * @returns 标准化的错误响应
     */
    static handleError(error) {
        let errorMessage;
        let errorType;
        if (error instanceof ValidationError) {
            errorMessage = `输入验证错误: ${error.message}`;
            errorType = 'ValidationError';
        }
        else if (error instanceof DateParseError) {
            errorMessage = `日期解析错误: ${error.message}`;
            errorType = 'DateParseError';
        }
        else if (error instanceof DateRangeError) {
            errorMessage = `日期范围错误: ${error.message}`;
            errorType = 'DateRangeError';
        }
        else if (error instanceof ToolNotFoundError) {
            errorMessage = `工具错误: ${error.message}`;
            errorType = 'ToolNotFoundError';
        }
        else if (error instanceof Error) {
            errorMessage = `系统错误: ${error.message}`;
            errorType = 'SystemError';
        }
        else {
            errorMessage = '未知错误';
            errorType = 'UnknownError';
        }
        // 记录错误日志
        console.error(`[${errorType}] ${errorMessage}`, error);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        error: true,
                        type: errorType,
                        message: errorMessage,
                        timestamp: new Date().toISOString()
                    }, null, 2)
                }
            ],
            isError: true
        };
    }
    /**
     * 安全执行函数，自动处理错误
     * @param fn 要执行的函数
     * @returns 执行结果或错误响应
     */
    static async safeExecute(fn) {
        try {
            const result = await fn();
            return {
                success: true,
                data: result
            };
        }
        catch (error) {
            return {
                success: false,
                error: this.handleError(error)
            };
        }
    }
    /**
     * 验证并抛出相应的错误
     * @param validation 验证结果
     */
    static validateAndThrow(validation) {
        if (!validation.isValid) {
            throw new ValidationError(validation.error || '验证失败');
        }
    }
    /**
     * 创建标准成功响应
     * @param data 响应数据
     * @returns 标准成功响应
     */
    static createSuccessResponse(data) {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(data, null, 2)
                }
            ]
        };
    }
    /**
     * 记录操作日志
     * @param operation 操作名称
     * @param params 操作参数
     * @param result 操作结果
     */
    static logOperation(operation, params, result) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            operation,
            params,
            success: result !== undefined,
            ...(result && { result })
        };
        console.log(`[Operation] ${JSON.stringify(logEntry)}`);
    }
    /**
     * 检查系统资源和限制
     * @param operation 操作类型
     * @param params 操作参数
     */
    static checkSystemLimits(operation, params) {
        switch (operation) {
            case 'get_date_range_info':
                // 检查日期范围大小
                if (params.startDate && params.endDate) {
                    let startDate;
                    let endDate;
                    // 处理字符串或Date对象
                    if (typeof params.startDate === 'string') {
                        startDate = new Date(params.startDate);
                    }
                    else {
                        startDate = params.startDate;
                    }
                    if (typeof params.endDate === 'string') {
                        endDate = new Date(params.endDate);
                    }
                    else {
                        endDate = params.endDate;
                    }
                    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (daysDiff > 366) {
                        throw new DateRangeError('查询范围过大，可能影响系统性能');
                    }
                }
                break;
            default:
                // 其他操作的限制检查
                break;
        }
    }
    /**
     * 格式化错误信息为用户友好的格式
     * @param error 错误对象
     * @returns 用户友好的错误信息
     */
    static formatUserFriendlyError(error) {
        if (error instanceof ValidationError) {
            return `参数错误：${error.message}`;
        }
        else if (error instanceof DateParseError) {
            return `日期格式错误：${error.message}`;
        }
        else if (error instanceof DateRangeError) {
            return `日期范围错误：${error.message}`;
        }
        else if (error instanceof ToolNotFoundError) {
            return `功能不存在：${error.message}`;
        }
        else if (error instanceof Error) {
            return `系统错误：${error.message}`;
        }
        else {
            return '发生了未知错误，请稍后重试';
        }
    }
}
