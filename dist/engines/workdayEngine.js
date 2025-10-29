import { adjustmentRules } from '../data/adjustmentRules.js';
import { DateUtils } from '../utils/dateUtils.js';
/**
 * 工作日判断引擎
 */
export class WorkdayEngine {
    /**
     * 判断指定日期的工作日类型
     * @param date 日期
     * @returns 工作日类型和调休信息
     */
    static getDayType(date) {
        const dateStr = DateUtils.formatDateString(date);
        const year = date.getFullYear();
        // 获取该年的调休规则
        const yearRules = adjustmentRules.filter(rule => rule.year === year);
        // 检查是否为法定节假日
        for (const rule of yearRules) {
            if (rule.holidayDates.includes(dateStr)) {
                // 如果是周一到周五，但被设为节假日，则为调休
                if (DateUtils.isWeekday(date)) {
                    return { dayType: '休息日', adjusted: '调休' };
                }
                return { dayType: '休息日' };
            }
        }
        // 检查是否为调休工作日
        for (const rule of yearRules) {
            if (rule.workingDates.includes(dateStr)) {
                // 如果是周末，但被设为工作日，则为调休
                if (DateUtils.isWeekend(date)) {
                    return { dayType: '工作日', adjusted: '调休' };
                }
                return { dayType: '工作日' };
            }
        }
        // 按照正常规律判断
        if (DateUtils.isWeekend(date)) {
            return { dayType: '休息日' };
        }
        else {
            return { dayType: '工作日' };
        }
    }
    /**
     * 判断是否为工作日
     * @param date 日期
     * @returns 是否为工作日
     */
    static isWorkday(date) {
        const result = this.getDayType(date);
        return result.dayType === '工作日';
    }
    /**
     * 判断是否为休息日
     * @param date 日期
     * @returns 是否为休息日
     */
    static isHoliday(date) {
        const result = this.getDayType(date);
        return result.dayType === '休息日';
    }
    /**
     * 判断是否为调休日
     * @param date 日期
     * @returns 是否为调休日
     */
    static isAdjusted(date) {
        const result = this.getDayType(date);
        return result.adjusted === '调休';
    }
    /**
     * 获取指定年份的所有法定节假日
     * @param year 年份
     * @returns 法定节假日日期数组
     */
    static getYearHolidays(year) {
        const yearRules = adjustmentRules.filter(rule => rule.year === year);
        const holidays = [];
        for (const rule of yearRules) {
            holidays.push(...rule.holidayDates);
        }
        return holidays.sort();
    }
    /**
     * 获取指定年份的所有调休工作日
     * @param year 年份
     * @returns 调休工作日日期数组
     */
    static getYearWorkingDays(year) {
        const yearRules = adjustmentRules.filter(rule => rule.year === year);
        const workingDays = [];
        for (const rule of yearRules) {
            workingDays.push(...rule.workingDates);
        }
        return workingDays.sort();
    }
    /**
     * 获取指定节日的调休安排
     * @param year 年份
     * @param holiday 节日名称
     * @returns 调休安排信息
     */
    static getHolidayAdjustment(year, holiday) {
        return adjustmentRules.find(rule => rule.year === year && rule.holiday === holiday);
    }
    /**
     * 计算指定日期范围内的工作日数量
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @returns 工作日数量
     */
    static countWorkdays(startDate, endDate) {
        const dates = DateUtils.generateDateRange(startDate, endDate);
        return dates.filter(date => this.isWorkday(date)).length;
    }
    /**
     * 计算指定日期范围内的休息日数量
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @returns 休息日数量
     */
    static countHolidays(startDate, endDate) {
        const dates = DateUtils.generateDateRange(startDate, endDate);
        return dates.filter(date => this.isHoliday(date)).length;
    }
    /**
     * 获取下一个工作日
     * @param date 当前日期
     * @returns 下一个工作日
     */
    static getNextWorkday(date) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        while (!this.isWorkday(nextDay)) {
            nextDay.setDate(nextDay.getDate() + 1);
        }
        return nextDay;
    }
    /**
     * 获取上一个工作日
     * @param date 当前日期
     * @returns 上一个工作日
     */
    static getPreviousWorkday(date) {
        const prevDay = new Date(date);
        prevDay.setDate(prevDay.getDate() - 1);
        while (!this.isWorkday(prevDay)) {
            prevDay.setDate(prevDay.getDate() - 1);
        }
        return prevDay;
    }
}
