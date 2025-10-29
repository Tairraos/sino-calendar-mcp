/**
 * 农历转换引擎
 */
export declare class LunarEngine {
    /**
     * 将公历日期转换为农历格式
     * @param date 公历日期
     * @returns 中文农历格式，如：壬辰年闰四月初六
     */
    static convertToLunar(date: Date): string;
    /**
     * 获取农历年份的天干地支
     */
    static getYearInGanZhi(date: Date): string;
    /**
     * 获取农历月份（中文）
     */
    static getMonthInChinese(date: Date): string;
    /**
     * 获取农历日期（中文）
     */
    static getDayInChinese(date: Date): string;
    /**
     * 检查是否为闰月
     * @param date 日期
     * @returns 是否为闰月
     */
    static isLeapMonth(date: Date): boolean;
    /**
     * 获取指定年份的闰月
     * @param date 日期
     * @returns 闰月月份，0表示无闰月
     */
    static getLeapMonth(date: Date): number;
}
