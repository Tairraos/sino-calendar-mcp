import { LunarYear, Solar } from 'lunar-javascript';
/**
 * 农历转换引擎
 */
export class LunarEngine {
    /**
     * 将公历日期转换为农历格式
     * @param date 公历日期
     * @returns 中文农历格式，如：壬辰年闰四月初六
     */
    static convertToLunar(date) {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        // 获取年份天干地支
        const yearInGanZhi = lunar.getYearInGanZhi();
        // 获取月份
        const monthInChinese = lunar.getMonthInChinese();
        // 判断是否为闰月
        const isLeapMonth = lunar.leap > 0;
        const monthStr = isLeapMonth ? `闰${monthInChinese}` : monthInChinese;
        // 获取日期
        const dayInChinese = lunar.getDayInChinese();
        return `${yearInGanZhi}年${monthStr}月${dayInChinese}`;
    }
    /**
     * 获取农历年份的天干地支
     */
    static getYearInGanZhi(date) {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        return lunar.getYearInGanZhi();
    }
    /**
     * 获取农历月份（中文）
     */
    static getMonthInChinese(date) {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        const monthInChinese = lunar.getMonthInChinese();
        const isLeapMonth = lunar.leap > 0;
        return isLeapMonth ? `闰${monthInChinese}` : monthInChinese;
    }
    /**
     * 获取农历日期（中文）
     */
    static getDayInChinese(date) {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        return lunar.getDayInChinese();
    }
    /**
     * 检查是否为闰月
     * @param date 日期
     * @returns 是否为闰月
     */
    static isLeapMonth(date) {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        const year = lunar.getYear();
        const month = lunar.getMonth();
        // 获取该年的闰月
        const lunarYear = LunarYear.fromYear(year);
        const leapMonth = lunarYear.getLeapMonth();
        // 检查当前月份是否是闰月
        return leapMonth === month;
    }
    /**
     * 获取指定年份的闰月
     * @param date 日期
     * @returns 闰月月份，0表示无闰月
     */
    static getLeapMonth(date) {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        const year = lunar.getYear();
        const lunarYear = LunarYear.fromYear(year);
        return lunarYear.getLeapMonth();
    }
}
