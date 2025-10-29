/**
 * 工作日判断引擎
 */
export declare class WorkdayEngine {
    /**
     * 判断指定日期的工作日类型
     * @param date 日期
     * @returns 工作日类型和调休信息
     */
    static getDayType(date: Date): {
        dayType: string;
        adjusted?: string;
    };
    /**
     * 判断是否为工作日
     * @param date 日期
     * @returns 是否为工作日
     */
    static isWorkday(date: Date): boolean;
    /**
     * 判断是否为休息日
     * @param date 日期
     * @returns 是否为休息日
     */
    static isHoliday(date: Date): boolean;
    /**
     * 判断是否为调休日
     * @param date 日期
     * @returns 是否为调休日
     */
    static isAdjusted(date: Date): boolean;
    /**
     * 获取指定年份的所有法定节假日
     * @param year 年份
     * @returns 法定节假日日期数组
     */
    static getYearHolidays(year: number): string[];
    /**
     * 获取指定年份的所有调休工作日
     * @param year 年份
     * @returns 调休工作日日期数组
     */
    static getYearWorkingDays(year: number): string[];
    /**
     * 获取指定节日的调休安排
     * @param year 年份
     * @param holiday 节日名称
     * @returns 调休安排信息
     */
    static getHolidayAdjustment(year: number, holiday: string): import("../types/index.js").AdjustmentRule | undefined;
    /**
     * 计算指定日期范围内的工作日数量
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @returns 工作日数量
     */
    static countWorkdays(startDate: Date, endDate: Date): number;
    /**
     * 计算指定日期范围内的休息日数量
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @returns 休息日数量
     */
    static countHolidays(startDate: Date, endDate: Date): number;
    /**
     * 获取下一个工作日
     * @param date 当前日期
     * @returns 下一个工作日
     */
    static getNextWorkday(date: Date): Date;
    /**
     * 获取上一个工作日
     * @param date 当前日期
     * @returns 上一个工作日
     */
    static getPreviousWorkday(date: Date): Date;
}
