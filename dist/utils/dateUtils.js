import { format, isValid, parseISO } from 'date-fns';
/**
 * 日期工具函数
 */
export class DateUtils {
    /**
     * 验证日期字符串格式
     */
    static isValidDateString(dateString) {
        const date = parseISO(dateString);
        return isValid(date);
    }
    /**
     * 解析日期字符串为Date对象
     */
    static parseDate(dateString) {
        const date = parseISO(dateString);
        if (!isValid(date)) {
            throw new Error(`Invalid date string: ${dateString}`);
        }
        return date;
    }
    /**
     * 格式化日期为中文格式
     * @param date Date对象
     * @returns 中文日期格式，如：2025年9月5日
     */
    static formatChineseDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }
    /**
     * 格式化星期为中文
     * @param date Date对象
     * @returns 中文星期，如：星期五
     */
    static formatChineseWeek(date) {
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return weekdays[date.getDay()];
    }
    /**
     * 生成日期范围内的所有日期
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @returns Date数组
     */
    static generateDateRange(startDate, endDate) {
        const dates = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }
    /**
     * 格式化日期为YYYY-MM-DD格式
     */
    static formatDateString(date) {
        return format(date, 'yyyy-MM-dd');
    }
    /**
     * 判断是否为周末
     */
    static isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6; // 0=周日, 6=周六
    }
    /**
     * 判断是否为工作日（周一到周五）
     */
    static isWeekday(date) {
        return !this.isWeekend(date);
    }
}
