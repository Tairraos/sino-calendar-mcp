import { solarTerms } from '../data/solarTerms.js';
import { Solar } from 'lunar-javascript';
/**
 * 24节气计算引擎
 */
export class SolarTermEngine {
    /**
     * 获取指定日期的24节气
     * @param date 日期
     * @returns 节气名称，如果不是节气则返回null
     */
    static getSolarTerm(date) {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        // 使用getJieQi方法获取节气
        const jieQi = lunar.getJieQi();
        return jieQi || null;
    }
    /**
     * 获取指定年份的所有24节气
     * @param year 年份
     * @returns 节气名称到日期的映射
     */
    static getYearSolarTerms(year) {
        const solarTermsMap = new Map();
        // 遍历一年中的每一天，查找节气
        for (let month = 1; month <= 12; month++) {
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month - 1, day);
                const solarTerm = this.getSolarTerm(date);
                if (solarTerm) {
                    solarTermsMap.set(solarTerm, date);
                }
            }
        }
        return solarTermsMap;
    }
    /**
     * 获取下一个节气
     * @param date 当前日期
     * @returns 下一个节气的名称和日期
     */
    static getNextSolarTerm(date) {
        const year = date.getFullYear();
        const yearSolarTerms = this.getYearSolarTerms(year);
        // 找到当前日期之后的第一个节气
        for (const [name, solarTermDate] of yearSolarTerms) {
            if (solarTermDate > date) {
                return { name, date: solarTermDate };
            }
        }
        // 如果当年没有找到，查找下一年的第一个节气
        const nextYearSolarTerms = this.getYearSolarTerms(year + 1);
        const firstSolarTerm = Array.from(nextYearSolarTerms.entries())[0];
        if (firstSolarTerm) {
            return { name: firstSolarTerm[0], date: firstSolarTerm[1] };
        }
        return undefined;
    }
    /**
     * 获取上一个节气
     * @param date 当前日期
     * @returns 上一个节气的名称和日期
     */
    static getPreviousSolarTerm(date) {
        const year = date.getFullYear();
        const yearSolarTerms = this.getYearSolarTerms(year);
        // 将节气按日期排序
        const sortedSolarTerms = Array.from(yearSolarTerms.entries())
            .sort((a, b) => a[1].getTime() - b[1].getTime());
        // 找到当前日期之前的最后一个节气
        for (let i = sortedSolarTerms.length - 1; i >= 0; i--) {
            const [name, solarTermDate] = sortedSolarTerms[i];
            if (solarTermDate < date) {
                return { name, date: solarTermDate };
            }
        }
        // 如果当年没有找到，查找上一年的最后一个节气
        const prevYearSolarTerms = this.getYearSolarTerms(year - 1);
        const sortedPrevYearSolarTerms = Array.from(prevYearSolarTerms.entries())
            .sort((a, b) => a[1].getTime() - b[1].getTime());
        const lastSolarTerm = sortedPrevYearSolarTerms[sortedPrevYearSolarTerms.length - 1];
        if (lastSolarTerm) {
            return { name: lastSolarTerm[0], date: lastSolarTerm[1] };
        }
        return undefined;
    }
    /**
     * 检查指定日期是否为24节气
     * @param date 日期
     * @returns 是否为节气
     */
    static isSolarTerm(date) {
        return this.getSolarTerm(date) !== null;
    }
    /**
     * 获取所有24节气列表
     */
    static getAllSolarTerms() {
        return solarTerms;
    }
    /**
     * 根据节气名称获取节气信息
     * @param name 节气名称
     * @returns 节气信息
     */
    static getSolarTermByName(name) {
        return solarTerms.find(term => term.name === name);
    }
}
