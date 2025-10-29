/**
 * 日期工具函数
 */
export declare class DateUtils {
    /**
     * 验证日期字符串格式
     */
    static isValidDateString(dateString: string): boolean;
    /**
     * 解析日期字符串为Date对象
     */
    static parseDate(dateString: string): Date;
    /**
     * 格式化日期为中文格式
     * @param date Date对象
     * @returns 中文日期格式，如：2025年9月5日
     */
    static formatChineseDate(date: Date): string;
    /**
     * 格式化星期为中文
     * @param date Date对象
     * @returns 中文星期，如：星期五
     */
    static formatChineseWeek(date: Date): string;
    /**
     * 生成日期范围内的所有日期
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @returns Date数组
     */
    static generateDateRange(startDate: Date, endDate: Date): Date[];
    /**
     * 格式化日期为YYYY-MM-DD格式
     */
    static formatDateString(date: Date): string;
    /**
     * 判断是否为周末
     */
    static isWeekend(date: Date): boolean;
    /**
     * 判断是否为工作日（周一到周五）
     */
    static isWeekday(date: Date): boolean;
}
