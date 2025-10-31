/**
 * 输入验证工具类
 */
export declare class Validator {
    /**
     * 验证日期字符串格式
     * @param dateStr 日期字符串
     * @returns 验证结果
     */
    static validateDateString(dateStr: any): {
        isValid: boolean;
        error?: string;
    };
    /**
     * 验证日期范围
     * @param startDateStr 开始日期字符串
     * @param endDateStr 结束日期字符串
     * @returns 验证结果
     */
    static validateDateRange(startDateStr: any, endDateStr: any): {
        isValid: boolean;
        error?: string;
    };
    /**
     * 验证工具参数
     * @param toolName 工具名称
     * @param args 参数对象
     * @returns 验证结果
     */
    static validateToolArgs(toolName: string, args: any): {
        isValid: boolean;
        error?: string;
    };
    /**
     * 验证get_date_info工具的参数
     */
    private static validateGetDateInfoArgs;
    /**
     * 验证get_date_range_info工具的参数
     */
    private static validateGetDateRangeInfoArgs;
    /**
     * 验证年份
     * @param year 年份
     * @returns 验证结果
     */
    static validateYear(year: any): {
        isValid: boolean;
        error?: string;
    };
    /**
     * 验证月份
     * @param month 月份
     * @returns 验证结果
     */
    static validateMonth(month: any): {
        isValid: boolean;
        error?: string;
    };
    /**
     * 验证反向查询参数
     * @param args 参数对象
     * @returns 验证结果
     */
    private static validateReverseQueryByNameArgs;
    /**
     * 验证日期范围条件查询参数
     * @param args 参数对象
     * @returns 验证结果
     */
    private static validateQueryByDateRangeArgs;
    /**
     * 验证农历日期字符串
     * @param lunarDateStr 农历日期字符串
     * @returns 验证结果
     */
    static validateLunarDateString(lunarDateStr: any): {
        isValid: boolean;
        error?: string;
    };
    /**
     * 验证节日名称
     * @param festivalName 节日名称
     * @returns 验证结果
     */
    static validateFestivalName(festivalName: any): {
        isValid: boolean;
        error?: string;
    };
    /**
     * 验证节气名称
     * @param termName 节气名称
     * @returns 验证结果
     */
    static validateSolarTermName(termName: any): {
        isValid: boolean;
        error?: string;
    };
}
