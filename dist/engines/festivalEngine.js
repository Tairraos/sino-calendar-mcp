import { festivals } from '../data/festivals.js';
import { Solar } from 'lunar-javascript';
/**
 * 节日识别引擎
 */
export class FestivalEngine {
    /**
     * 识别指定日期的节日
     * @param date 公历日期
     * @returns 节日名称，如果没有节日则返回undefined
     */
    static getFestival(date) {
        // 检查公历节日
        const solarFestival = this.getSolarFestival(date);
        if (solarFestival) {
            return solarFestival;
        }
        // 检查农历节日
        const lunarFestival = this.getLunarFestival(date);
        if (lunarFestival) {
            return lunarFestival;
        }
        // 检查西方节日
        const westernFestival = this.getWesternFestival(date);
        if (westernFestival) {
            return westernFestival;
        }
        return undefined;
    }
    /**
     * 获取公历节日
     */
    static getSolarFestival(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${month}-${day}`;
        const festival = festivals.find(f => f.type === 'solar' && f.isFixed && f.date === dateStr);
        return festival?.name;
    }
    /**
     * 获取农历节日
     */
    static getLunarFestival(date) {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        const month = String(lunar.getMonth()).padStart(2, '0');
        const day = String(lunar.getDay()).padStart(2, '0');
        const dateStr = `${month}-${day}`;
        // 处理除夕特殊情况
        if (this.isChineseNewYearEve(date)) {
            return '除夕';
        }
        const festival = festivals.find(f => f.type === 'lunar' && f.isFixed && f.date === dateStr);
        return festival?.name;
    }
    /**
     * 获取西方节日
     */
    static getWesternFestival(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${month}-${day}`;
        // 检查固定日期的西方节日
        const fixedFestival = festivals.find(f => f.type === 'western' && f.isFixed && f.date === dateStr);
        if (fixedFestival) {
            return fixedFestival.name;
        }
        // 检查非固定日期的西方节日
        return this.getVariableWesternFestival(date);
    }
    /**
     * 获取非固定日期的西方节日
     */
    static getVariableWesternFestival(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayOfWeek = date.getDay();
        // 复活节计算
        const easterDate = this.calculateEaster(year);
        if (month === easterDate.month && day === easterDate.day) {
            return '复活节';
        }
        // 母亲节：5月第二个星期日
        if (month === 5 && dayOfWeek === 0) {
            const secondSunday = this.getNthWeekdayOfMonth(year, 5, 0, 2);
            if (day === secondSunday) {
                return '母亲节';
            }
        }
        // 父亲节：6月第三个星期日
        if (month === 6 && dayOfWeek === 0) {
            const thirdSunday = this.getNthWeekdayOfMonth(year, 6, 0, 3);
            if (day === thirdSunday) {
                return '父亲节';
            }
        }
        // 感恩节：11月第四个星期四
        if (month === 11 && dayOfWeek === 4) {
            const fourthThursday = this.getNthWeekdayOfMonth(year, 11, 4, 4);
            if (day === fourthThursday) {
                return '感恩节';
            }
        }
        return undefined;
    }
    /**
     * 计算复活节日期（使用格里高利历算法）
     * @param year 年份
     * @returns 复活节的月份和日期
     */
    static calculateEaster(year) {
        // 使用匿名格里高利历算法计算复活节
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return { month, day };
    }
    /**
     * 获取某月第N个星期X的日期
     * @param year 年份
     * @param month 月份（1-12）
     * @param dayOfWeek 星期几（0=周日，1=周一...6=周六）
     * @param nth 第几个
     */
    static getNthWeekdayOfMonth(year, month, dayOfWeek, nth) {
        const firstDay = new Date(year, month - 1, 1);
        const firstDayOfWeek = firstDay.getDay();
        // 计算第一个目标星期几的日期
        let firstTargetDay = 1 + (dayOfWeek - firstDayOfWeek + 7) % 7;
        // 计算第N个目标星期几的日期
        return firstTargetDay + (nth - 1) * 7;
    }
    /**
     * 判断是否为除夕
     */
    static isChineseNewYearEve(date) {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        // 除夕是农历年的最后一天
        const month = lunar.getMonth();
        const day = lunar.getDay();
        // 农历12月的最后一天
        if (month === 12) {
            // 获取下一天的农历日期
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextSolar = Solar.fromDate(nextDay);
            const nextLunar = nextSolar.getLunar();
            // 如果下一天是农历正月初一，则今天是除夕
            return nextLunar.getMonth() === 1 && nextLunar.getDay() === 1;
        }
        return false;
    }
    /**
     * 获取指定日期的所有节日
     * @param date 公历日期
     * @returns 节日数组
     */
    static getFestivalsByDate(date) {
        const result = [];
        const festival = this.getFestival(date);
        if (festival) {
            const festivalData = festivals.find(f => f.name === festival);
            if (festivalData) {
                result.push(festivalData);
            }
        }
        return result;
    }
    /**
     * 获取指定类型的所有节日
     * @param type 节日类型
     * @returns 节日数组
     */
    static getFestivalsByType(type) {
        return festivals.filter(f => f.type === type);
    }
    /**
     * 获取所有节日列表
     */
    static getAllFestivals() {
        return festivals;
    }
}
