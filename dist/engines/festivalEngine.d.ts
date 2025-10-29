import { Festival } from '../types/index.js';
/**
 * 节日识别引擎
 */
export declare class FestivalEngine {
    /**
     * 识别指定日期的节日
     * @param date 公历日期
     * @returns 节日名称，如果没有节日则返回undefined
     */
    static getFestival(date: Date): string | undefined;
    /**
     * 获取公历节日
     */
    private static getSolarFestival;
    /**
     * 获取农历节日
     */
    private static getLunarFestival;
    /**
     * 获取西方节日
     */
    private static getWesternFestival;
    /**
     * 获取非固定日期的西方节日
     */
    private static getVariableWesternFestival;
    /**
     * 计算复活节日期（使用格里高利历算法）
     * @param year 年份
     * @returns 复活节的月份和日期
     */
    private static calculateEaster;
    /**
     * 获取某月第N个星期X的日期
     * @param year 年份
     * @param month 月份（1-12）
     * @param dayOfWeek 星期几（0=周日，1=周一...6=周六）
     * @param nth 第几个
     */
    private static getNthWeekdayOfMonth;
    /**
     * 判断是否为除夕
     */
    private static isChineseNewYearEve;
    /**
     * 获取指定日期的所有节日
     * @param date 公历日期
     * @returns 节日数组
     */
    static getFestivalsByDate(date: Date): Festival[];
    /**
     * 获取指定类型的所有节日
     * @param type 节日类型
     * @returns 节日数组
     */
    static getFestivalsByType(type: string): Festival[];
    /**
     * 获取所有节日列表
     */
    static getAllFestivals(): Festival[];
}
