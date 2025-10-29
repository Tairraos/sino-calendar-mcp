import { DateInfo, DateRangeResponse } from '../types/index.js';
/**
 * 日期信息引擎 - 核心业务逻辑
 */
export declare class DateInfoEngine {
    /**
     * 获取单个日期的完整信息
     * @param date 日期
     * @returns 日期信息对象
     */
    static getDateInfo(date: Date): DateInfo;
    /**
     * 获取日期范围内所有日期的信息
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @returns 日期范围响应对象
     */
    static getDateRangeInfo(startDate: Date, endDate: Date): DateRangeResponse;
    /**
     * 获取指定日期的详细统计信息
     * @param date 日期
     * @returns 详细统计信息
     */
    static getDateStatistics(date: Date): {
        statistics: {
            isWorkday: boolean;
            isHoliday: boolean;
            isAdjusted: boolean;
            isWeekend: boolean;
            isSolarTerm: boolean;
            isLeapMonth: boolean;
            yearHolidaysCount: number;
            yearWorkingDaysCount: number;
        };
        date: string;
        week: string;
        dayType: string;
        adjusted?: string;
        festival?: string;
        solarTerm?: string;
        lunarDate: string;
    };
    /**
     * 查找指定月份的所有节日
     * @param year 年份
     * @param month 月份（1-12）
     * @returns 该月的所有节日信息
     */
    static getMonthFestivals(year: number, month: number): {
        date: string;
        festival: string | undefined;
    }[];
    /**
     * 查找指定年份的所有节气
     * @param year 年份
     * @returns 该年的所有节气信息
     */
    static getYearSolarTerms(year: number): {
        name: string;
        date: string;
    }[];
    /**
     * 获取指定日期周围的重要信息
     * @param date 中心日期
     * @param days 前后天数（默认7天）
     * @returns 周围日期的重要信息
     */
    static getSurroundingInfo(date: Date, days?: number): {
        centerDate: DateInfo;
        surroundingDates: DateInfo[];
        totalDays: number;
    };
}
