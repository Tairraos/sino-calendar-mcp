import { DateUtils } from '../utils/dateUtils.js';
import { LunarEngine } from './lunarEngine.js';
import { SolarTermEngine } from './solarTermEngine.js';
import { FestivalEngine } from './festivalEngine.js';
import { WorkdayEngine } from './workdayEngine.js';
import { ErrorHandler } from '../utils/errorHandler.js';
/**
 * 日期信息引擎 - 核心业务逻辑
 */
export class DateInfoEngine {
    /**
     * 获取单个日期的完整信息
     * @param date 日期
     * @returns 日期信息对象
     */
    static getDateInfo(date) {
        // 基础日期信息
        const dateStr = DateUtils.formatChineseDate(date);
        const week = DateUtils.formatChineseWeek(date);
        // 工作日类型和调休信息
        const workdayInfo = WorkdayEngine.getDayType(date);
        // 农历信息
        const lunarDate = LunarEngine.convertToLunar(date);
        // 节日信息
        const festival = FestivalEngine.getFestival(date);
        // 24节气信息
        const solarTerm = SolarTermEngine.getSolarTerm(date);
        // 构建返回对象
        const dateInfo = {
            date: dateStr,
            week: week,
            dayType: workdayInfo.dayType,
            lunarDate: lunarDate
        };
        // 添加可选字段
        if (workdayInfo.adjusted) {
            dateInfo.adjusted = workdayInfo.adjusted;
        }
        if (festival) {
            dateInfo.festival = festival;
        }
        if (solarTerm) {
            dateInfo.solarTerm = solarTerm;
        }
        return dateInfo;
    }
    /**
     * 获取日期范围内所有日期的信息
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @returns 日期范围响应对象
     */
    static getDateRangeInfo(startDate, endDate) {
        // 验证日期范围
        if (startDate > endDate) {
            throw new Error('开始日期不能晚于结束日期');
        }
        // 使用ErrorHandler检查系统限制
        ErrorHandler.checkSystemLimits('get_date_range_info', { startDate, endDate });
        // 生成日期范围
        const dates = DateUtils.generateDateRange(startDate, endDate);
        // 获取每个日期的信息
        const dateInfos = dates.map(date => this.getDateInfo(date));
        return {
            dates: dateInfos
        };
    }
    /**
     * 获取指定日期的详细统计信息
     * @param date 日期
     * @returns 详细统计信息
     */
    static getDateStatistics(date) {
        const dateInfo = this.getDateInfo(date);
        const year = date.getFullYear();
        return {
            ...dateInfo,
            statistics: {
                isWorkday: WorkdayEngine.isWorkday(date),
                isHoliday: WorkdayEngine.isHoliday(date),
                isAdjusted: WorkdayEngine.isAdjusted(date),
                isWeekend: DateUtils.isWeekend(date),
                isSolarTerm: SolarTermEngine.isSolarTerm(date),
                isLeapMonth: LunarEngine.isLeapMonth(date),
                yearHolidaysCount: WorkdayEngine.getYearHolidays(year).length,
                yearWorkingDaysCount: WorkdayEngine.getYearWorkingDays(year).length
            }
        };
    }
    /**
     * 查找指定月份的所有节日
     * @param year 年份
     * @param month 月份（1-12）
     * @returns 该月的所有节日信息
     */
    static getMonthFestivals(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // 该月最后一天
        const dates = DateUtils.generateDateRange(startDate, endDate);
        const festivals = dates
            .map(date => ({
            date: DateUtils.formatChineseDate(date),
            festival: FestivalEngine.getFestival(date)
        }))
            .filter(item => item.festival);
        return festivals;
    }
    /**
     * 查找指定年份的所有节气
     * @param year 年份
     * @returns 该年的所有节气信息
     */
    static getYearSolarTerms(year) {
        const solarTermsMap = SolarTermEngine.getYearSolarTerms(year);
        const solarTermsList = Array.from(solarTermsMap.entries()).map(([name, date]) => ({
            name,
            date: DateUtils.formatChineseDate(date),
            dateObj: date
        })).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        return solarTermsList.map(({ name, date }) => ({ name, date }));
    }
    /**
     * 获取指定日期周围的重要信息
     * @param date 中心日期
     * @param days 前后天数（默认7天）
     * @returns 周围日期的重要信息
     */
    static getSurroundingInfo(date, days = 7) {
        const startDate = new Date(date);
        startDate.setDate(startDate.getDate() - days);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + days);
        const rangeInfo = this.getDateRangeInfo(startDate, endDate);
        // 筛选出有特殊信息的日期
        const importantDates = rangeInfo.dates.filter(dateInfo => dateInfo.festival || dateInfo.solarTerm || dateInfo.adjusted);
        return {
            centerDate: this.getDateInfo(date),
            surroundingDates: importantDates,
            totalDays: rangeInfo.dates.length
        };
    }
}
