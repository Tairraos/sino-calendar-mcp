/**
 * 反向查询引擎 - 实现反向查询功能
 * 支持通过农历日期、节日名称、节气名称等条件反向查询公历日期
 */

import { DateInfo } from '../types/index.js';
import { DateInfoEngine } from './dateInfoEngine.js';
import { LunarEngine } from './lunarEngine.js';
import { FestivalEngine } from './festivalEngine.js';
import { SolarTermEngine } from './solarTermEngine.js';
import { DateUtils } from '../utils/dateUtils.js';

export class ReverseQueryEngine {
  /**
   * 农历日期反向查询
   * @param lunarDate 农历日期字符串（如：农历2025年正月初一）
   * @param yearRange 年份范围数组
   * @returns 匹配的公历日期信息数组
   */
  static queryLunarDate(lunarDate: string, yearRange: number[]): DateInfo[] {
    const results: DateInfo[] = [];

    // 解析农历日期字符串
    const parsedLunar = this.parseLunarDateString(lunarDate);
    if (!parsedLunar) {
      return results;
    }

    // 遍历年份范围，查找匹配的公历日期
    for (const year of yearRange) {
      const solarDates = this.findSolarDatesForLunar(
        parsedLunar.year,
        parsedLunar.month,
        parsedLunar.day,
        year,
        parsedLunar.isLeap,
      );

      // 获取每个匹配日期的详细信息
      for (const solarDate of solarDates) {
        const date = new Date(solarDate);
        const dateInfo = DateInfoEngine.getDateInfo(date);
        results.push(dateInfo);
      }
    }

    return results.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * 节日名称反向查询
   * @param festivalName 节日名称（如：春节、中秋节）
   * @param yearRange 年份范围数组
   * @returns 匹配的公历日期信息数组
   */
  static queryFestival(festivalName: string, yearRange: number[]): DateInfo[] {
    const results: DateInfo[] = [];

    // 查找匹配的 festivals
    for (const year of yearRange) {
      // 获取该年份的所有节日
      const yearFestivals = this.getYearFestivals(year);

      for (const festival of yearFestivals) {
        if (festival.name.includes(festivalName) || festivalName.includes(festival.name)) {
          const date = new Date(festival.date);
          const dateInfo = DateInfoEngine.getDateInfo(date);
          results.push(dateInfo);
        }
      }
    }

    return results.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * 节气名称反向查询
   * @param termName 节气名称（如：立春、冬至）
   * @param yearRange 年份范围数组
   * @returns 匹配的公历日期信息数组
   */
  static querySolarTerm(termName: string, yearRange: number[]): DateInfo[] {
    const results: DateInfo[] = [];

    // 获取节气索引映射
    const termIndex = this.getSolarTermIndex(termName);
    if (termIndex === -1) {
      return results;
    }

    // 遍历年份范围，查找匹配的节气日期
    for (const year of yearRange) {
      const solarTerms = SolarTermEngine.getYearSolarTerms(year);

      for (const [name, date] of solarTerms) {
        if (name === termName) {
          const dateInfo = DateInfoEngine.getDateInfo(date);
          results.push(dateInfo);
        }
      }
    }

    return results.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * 日期范围条件查询
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @param type 查询类型（rest_days | work_days | festivals | solar_terms）
   * @returns 匹配的日期信息数组
   */
  static queryByDateRange(startDate: string, endDate: string, type: string): DateInfo[] {
    const results: DateInfo[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 生成日期范围
    const dates = DateUtils.generateDateRange(start, end);

    // 确保 dates 是数组
    if (!Array.isArray(dates)) {
      return results;
    }

    // 根据类型筛选日期
    for (const date of dates) {
      const dateInfo = DateInfoEngine.getDateInfo(date);

      switch (type) {
        case 'rest_days':
          if (this.isRestDay(dateInfo)) {
            results.push(dateInfo);
          }
          break;

        case 'work_days':
          if (this.isWorkDay(dateInfo)) {
            results.push(dateInfo);
          }
          break;

        case 'festivals':
          if (dateInfo.festival) {
            results.push(dateInfo);
          }
          break;

        case 'solar_terms':
          if (dateInfo.solarTerm) {
            results.push(dateInfo);
          }
          break;
      }
    }

    return results;
  }

  /**
   * 判断是否为休息日
   * @param dateInfo 日期信息
   * @returns 是否为休息日
   */
  static isRestDay(dateInfo: DateInfo): boolean {
    // 周末是休息日
    if (dateInfo.dayType === '周末') {
      return true;
    }

    // 节假日是休息日（需要排除调休的工作日）
    if (dateInfo.dayType === '节假日' && dateInfo.adjusted !== '调休工作日') {
      return true;
    }

    return false;
  }

  /**
   * 判断是否为工作日
   * @param dateInfo 日期信息
   * @returns 是否为工作日
   */
  static isWorkDay(dateInfo: DateInfo): boolean {
    // 正常工作日
    if (dateInfo.dayType === '工作日') {
      return true;
    }

    // 调休的工作日（周末但需要上班）
    if (dateInfo.adjusted === '调休工作日') {
      return true;
    }

    return false;
  }

  /**
   * 解析农历日期字符串
   * @param lunarDateStr 农历日期字符串（如：农历2025年正月初一）
   * @returns 解析结果
   */
  private static parseLunarDateString(lunarDateStr: string): {
    year: number;
    month: number;
    day: number;
    isLeap: boolean;
  } | null {
    // 匹配农历日期格式：农历YYYY年MM月DD日
    const pattern =
      /农历(\d{4})年(闰?)([正一二三四五六七八九十冬腊]+)月([初一二三四五六七八九十廿]+)/;
    const match = lunarDateStr.match(pattern);

    if (!match) {
      return null;
    }

    const year = parseInt(match[1]);
    const isLeap = match[2] === '闰';
    const monthStr = match[3];
    const dayStr = match[4];

    // 转换月份
    const monthMap: { [key: string]: number } = {
      正: 1,
      二: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9,
      十: 10,
      冬: 11,
      腊: 12,
    };
    const month = monthMap[monthStr];

    // 转换日期
    const dayMap: { [key: string]: number } = {
      初一: 1,
      初二: 2,
      初三: 3,
      初四: 4,
      初五: 5,
      初六: 6,
      初七: 7,
      初八: 8,
      初九: 9,
      初十: 10,
      十一: 11,
      十二: 12,
      十三: 13,
      十四: 14,
      十五: 15,
      十六: 16,
      十七: 17,
      十八: 18,
      十九: 19,
      二十: 20,
      廿一: 21,
      廿二: 22,
      廿三: 23,
      廿四: 24,
      廿五: 25,
      廿六: 26,
      廿七: 27,
      廿八: 28,
      廿九: 29,
      三十: 30,
    };
    const day = dayMap[dayStr] || parseInt(dayStr.replace(/[初廿]/g, ''));

    return { year, month, day, isLeap };
  }

  /**
   * 查找指定农历日期在指定年份的所有公历对应日期
   * @param lunarYear 农历年份
   * @param lunarMonth 农历月份
   * @param lunarDay 农历日期
   * @param targetYear 目标年份
   * @param isLeap 是否为闰月
   * @returns 匹配的公历日期数组
   */
  private static findSolarDatesForLunar(
    lunarYear: number,
    lunarMonth: number,
    lunarDay: number,
    targetYear: number,
    isLeap: boolean,
  ): string[] {
    const results: string[] = [];

    // 遍历目标年份的每一天，查找匹配的农历日期
    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 31; day++) {
        try {
          const solarDate = new Date(targetYear, month, day);

          // 检查日期是否有效
          if (
            solarDate.getFullYear() !== targetYear ||
            solarDate.getMonth() !== month ||
            solarDate.getDate() !== day
          ) {
            continue;
          }

          // 转换为农历并比较
          const lunarDateStr = LunarEngine.convertToLunar(solarDate);

          // 解析农历日期字符串来获取月份和日期
          const lunarInfo = this.parseLunarDateString(lunarDateStr);
          if (lunarInfo && lunarInfo.month === lunarMonth && lunarInfo.day === lunarDay) {
            // 对于闰月，需要特别处理
            if (isLeap) {
              // 检查是否为闰月
              if (lunarInfo.isLeap) {
                results.push(DateUtils.formatDateString(solarDate));
              }
            } else {
              results.push(DateUtils.formatDateString(solarDate));
            }
          }
        } catch (error) {
          // 忽略无效日期
          continue;
        }
      }
    }

    return results;
  }

  /**
   * 获取指定年份的所有节日
   * @param year 年份
   * @returns 节日信息数组
   */
  private static getYearFestivals(year: number): { name: string; date: string }[] {
    const festivals: { name: string; date: string }[] = [];

    // 遍历该年的每一天，收集节日信息
    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 31; day++) {
        try {
          const date = new Date(year, month, day);

          // 检查日期是否有效
          if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
            continue;
          }

          const festival = FestivalEngine.getFestival(date);
          if (festival) {
            festivals.push({
              name: festival,
              date: DateUtils.formatDateString(date),
            });
          }
        } catch (error) {
          // 忽略无效日期
          continue;
        }
      }
    }

    return festivals;
  }

  /**
   * 获取节气索引
   * @param termName 节气名称
   * @returns 节气索引（0-23），-1表示未找到
   */
  private static getSolarTermIndex(termName: string): number {
    const solarTerms = [
      '立春',
      '雨水',
      '惊蛰',
      '春分',
      '清明',
      '谷雨',
      '立夏',
      '小满',
      '芒种',
      '夏至',
      '小暑',
      '大暑',
      '立秋',
      '处暑',
      '白露',
      '秋分',
      '寒露',
      '霜降',
      '立冬',
      '小雪',
      '大雪',
      '冬至',
      '小寒',
      '大寒',
    ];

    return solarTerms.indexOf(termName);
  }
}
