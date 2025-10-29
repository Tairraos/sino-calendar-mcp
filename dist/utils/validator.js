/**
 * 输入验证工具类
 */
export class Validator {
    /**
     * 验证日期字符串格式
     * @param dateStr 日期字符串
     * @returns 验证结果
     */
    static validateDateString(dateStr) {
        if (typeof dateStr !== 'string') {
            return { isValid: false, error: '日期必须是字符串类型' };
        }
        if (!dateStr.trim()) {
            return { isValid: false, error: '日期不能为空' };
        }
        // 检查格式
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(dateStr)) {
            return { isValid: false, error: '日期格式无效，请使用YYYY-MM-DD格式，如：2025-01-01' };
        }
        // 检查日期有效性
        const [year, month, day] = dateStr.split('-').map(Number);
        if (year < 1900 || year > 2100) {
            return { isValid: false, error: '年份必须在1900-2100之间' };
        }
        if (month < 1 || month > 12) {
            return { isValid: false, error: '月份必须在1-12之间' };
        }
        if (day < 1 || day > 31) {
            return { isValid: false, error: '日期必须在1-31之间' };
        }
        // 检查具体日期是否存在
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return { isValid: false, error: '日期不存在，请检查年月日是否正确' };
        }
        return { isValid: true };
    }
    /**
     * 验证日期范围
     * @param startDateStr 开始日期字符串
     * @param endDateStr 结束日期字符串
     * @returns 验证结果
     */
    static validateDateRange(startDateStr, endDateStr) {
        // 验证开始日期
        const startValidation = this.validateDateString(startDateStr);
        if (!startValidation.isValid) {
            return { isValid: false, error: `开始日期错误: ${startValidation.error}` };
        }
        // 验证结束日期
        const endValidation = this.validateDateString(endDateStr);
        if (!endValidation.isValid) {
            return { isValid: false, error: `结束日期错误: ${endValidation.error}` };
        }
        // 检查日期顺序
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        if (startDate > endDate) {
            return { isValid: false, error: '开始日期不能晚于结束日期' };
        }
        // 检查日期范围大小
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 366) {
            return { isValid: false, error: '查询范围不能超过366天（一年）' };
        }
        return { isValid: true };
    }
    /**
     * 验证工具参数
     * @param toolName 工具名称
     * @param args 参数对象
     * @returns 验证结果
     */
    static validateToolArgs(toolName, args) {
        if (!args || typeof args !== 'object') {
            return { isValid: false, error: '参数必须是对象类型' };
        }
        switch (toolName) {
            case 'get_date_info':
                return this.validateGetDateInfoArgs(args);
            case 'get_date_range_info':
                return this.validateGetDateRangeInfoArgs(args);
            default:
                return { isValid: false, error: `未知的工具: ${toolName}` };
        }
    }
    /**
     * 验证get_date_info工具的参数
     */
    static validateGetDateInfoArgs(args) {
        if (!args.hasOwnProperty('date')) {
            return { isValid: false, error: '缺少必需参数: date' };
        }
        return this.validateDateString(args.date);
    }
    /**
     * 验证get_date_range_info工具的参数
     */
    static validateGetDateRangeInfoArgs(args) {
        if (!args.hasOwnProperty('startDate')) {
            return { isValid: false, error: '缺少必需参数: startDate' };
        }
        if (!args.hasOwnProperty('endDate')) {
            return { isValid: false, error: '缺少必需参数: endDate' };
        }
        return this.validateDateRange(args.startDate, args.endDate);
    }
    /**
     * 验证年份
     * @param year 年份
     * @returns 验证结果
     */
    static validateYear(year) {
        if (typeof year !== 'number') {
            return { isValid: false, error: '年份必须是数字类型' };
        }
        if (!Number.isInteger(year)) {
            return { isValid: false, error: '年份必须是整数' };
        }
        if (year < 1900 || year > 2100) {
            return { isValid: false, error: '年份必须在1900-2100之间' };
        }
        return { isValid: true };
    }
    /**
     * 验证月份
     * @param month 月份
     * @returns 验证结果
     */
    static validateMonth(month) {
        if (typeof month !== 'number') {
            return { isValid: false, error: '月份必须是数字类型' };
        }
        if (!Number.isInteger(month)) {
            return { isValid: false, error: '月份必须是整数' };
        }
        if (month < 1 || month > 12) {
            return { isValid: false, error: '月份必须在1-12之间' };
        }
        return { isValid: true };
    }
}
