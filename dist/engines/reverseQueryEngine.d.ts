/**
 * 反向查询引擎 - 实现反向查询功能
 * 支持通过农历日期、节日名称、节气名称等条件反向查询公历日期
 */
import { DateInfo } from '../types/index.js';
export declare class ReverseQueryEngine {
    /**
     * 农历日期反向查询
     * @param lunarDate 农历日期字符串（如：农历2025年正月初一）
     * @param yearRange 年份范围数组
     * @returns 匹配的公历日期信息数组
     */
    static queryLunarDate(lunarDate: string, yearRange: number[]): DateInfo[];
    /**
     * 节日名称反向查询
     * @param festivalName 节日名称（如：春节、中秋节）
     * @param yearRange 年份范围数组
     * @returns 匹配的公历日期信息数组
     */
    static queryFestival(festivalName: string, yearRange: number[]): DateInfo[];
    /**
     * 节气名称反向查询
     * @param termName 节气名称（如：立春、冬至）
     * @param yearRange 年份范围数组
     * @returns 匹配的公历日期信息数组
     */
    static querySolarTerm(termName: string, yearRange: number[]): DateInfo[];
    /**
     * 日期范围条件查询
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param type 查询类型（rest_days | work_days | festivals | solar_terms）
     * @returns 匹配的日期信息数组
     */
    static queryByDateRange(startDate: string, endDate: string, type: string): DateInfo[];
    /**
     * 判断是否为休息日
     * @param dateInfo 日期信息
     * @returns 是否为休息日
     */
    static isRestDay(dateInfo: DateInfo): boolean;
    /**
     * 判断是否为工作日
     * @param dateInfo 日期信息
     * @returns 是否为工作日
     */
    static isWorkDay(dateInfo: DateInfo): boolean;
    /**
     * 解析农历日期字符串
     * @param lunarDateStr 农历日期字符串（如：农历2025年正月初一）
     * @returns 解析结果
     */
    private static parseLunarDateString;
    /**
     * 查找指定农历日期在指定年份的所有公历对应日期
     * @param lunarYear 农历年份
     * @param lunarMonth 农历月份
     * @param lunarDay 农历日期
     * @param targetYear 目标年份
     * @param isLeap 是否为闰月
     * @returns 匹配的公历日期数组
     */
    private static findSolarDatesForLunar;
    /**
     * 获取指定年份的所有节日
     * @param year 年份
     * @returns 节日信息数组
     */
    private static getYearFestivals;
    /**
     * 获取节气索引
     * @param termName 节气名称
     * @returns 节气索引（0-23），-1表示未找到
     */
    private static getSolarTermIndex;
}
