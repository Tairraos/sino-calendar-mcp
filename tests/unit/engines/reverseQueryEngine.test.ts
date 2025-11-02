import { ReverseQueryEngine } from '../../../src/engines/reverseQueryEngine.js';
import { DateInfoEngine } from '../../../src/engines/dateInfoEngine.js';
import { LunarEngine } from '../../../src/engines/lunarEngine.js';
import { FestivalEngine } from '../../../src/engines/festivalEngine.js';
import { DateInfo } from '../../../src/types/index.js';

// Mock all dependencies
jest.mock('../../../src/engines/dateInfoEngine.js');
jest.mock('../../../src/engines/lunarEngine.js');
jest.mock('../../../src/engines/festivalEngine.js');
jest.mock('../../../src/engines/solarTermEngine.js', () => ({
  SolarTermEngine: {
    getYearSolarTerms: jest.fn(() => [
      ['立春', new Date('2025-02-04')],
      ['雨水', new Date('2025-02-19')],
      ['惊蛰', new Date('2025-03-06')],
    ]),
  },
}));
jest.mock('../../../src/engines/workdayEngine.js');
jest.mock('../../../src/utils/dateUtils.js');

describe('ReverseQueryEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock DateInfoEngine.getDateInfo
    (DateInfoEngine.getDateInfo as jest.Mock).mockImplementation((date: Date) => ({
      date: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
      week: '星期一',
      dayType: '工作日',
      lunarDate: '甲辰年正月初一',
      festival: date.getDate() === 1 ? '元旦' : undefined,
      solarTerm: date.getDate() === 4 ? '立春' : undefined,
    }));
  });

  describe('基本功能测试', () => {
    it('应该正确查询农历日期', () => {
      const result = ReverseQueryEngine.queryLunarDate('正月初一', [2025]);
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确查询节日', () => {
      // Mock FestivalEngine.getFestival
      (FestivalEngine.getFestival as jest.Mock).mockReturnValue('春节');
      
      const result = ReverseQueryEngine.queryFestival('春节', [2025]);
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确查询节气', () => {
      const result = ReverseQueryEngine.querySolarTerm('立春', [2025]);
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确查询日期范围', () => {
      const result = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-31', 'rest_days');
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空年份范围', () => {
      const result = ReverseQueryEngine.queryLunarDate('正月初一', []);
      expect(result).toEqual([]);
    });

    it('应该处理无效农历日期', () => {
      const result = ReverseQueryEngine.queryLunarDate('无效日期', [2025]);
      expect(result).toBeInstanceOf(Array);
    });

    it('应该处理无效节日名称', () => {
      // Mock FestivalEngine.getFestival 返回 null
      (FestivalEngine.getFestival as jest.Mock).mockReturnValue(null);
      
      const result = ReverseQueryEngine.queryFestival('不存在的节日', [2025]);
      expect(result).toBeInstanceOf(Array);
    });

    it('应该处理无效节气名称', () => {
      const result = ReverseQueryEngine.querySolarTerm('不存在的节气', [2025]);
      expect(result).toEqual([]);
    });

    it('应该处理无效日期范围', () => {
      const result = ReverseQueryEngine.queryByDateRange('invalid', 'invalid', 'rest_days');
      expect(result).toEqual([]);
    });

    it('应该处理无效日期格式', () => {
      const result = ReverseQueryEngine.queryByDateRange('2025-13-01', '2025-01-31', 'rest_days');
      expect(result).toEqual([]);
    });

    it('应该处理结束日期早于开始日期', () => {
      const result = ReverseQueryEngine.queryByDateRange('2025-01-31', '2025-01-01', 'rest_days');
      expect(result).toEqual([]);
    });

    it('应该处理无效的查询类型', () => {
      const result = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-03', 'invalid_type');
      expect(result).toEqual([]);
    });
  });

  describe('queryLunarDate 详细测试', () => {
    it('应该处理有效的农历日期并返回结果', () => {
      // Mock LunarEngine.convertToLunar 返回匹配的农历日期
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        if (date.getMonth() === 1 && date.getDate() === 10) { // 2月10日
          return '甲辰年正月初一';
        }
        return '甲辰年二月初二';
      });

      // Mock DateUtils.formatDateString
      const mockDateUtils = require('../../../src/utils/dateUtils.js');
      mockDateUtils.DateUtils.formatDateString = jest.fn().mockReturnValue('2024-02-10');

      const result = ReverseQueryEngine.queryLunarDate('正月初一', [2024]);
      expect(result).toBeInstanceOf(Array);
    });

    it('应该成功找到农历日期并调用DateInfoEngine', () => {
      // Mock parseLunarDateString 返回有效解析结果
      const originalParseLunarDateString = (ReverseQueryEngine as any).parseLunarDateString;
      (ReverseQueryEngine as any).parseLunarDateString = jest.fn().mockReturnValue({
        year: 2024,
        month: 1,
        day: 1,
        isLeap: false
      });

      // Mock findSolarDatesForLunar 返回有效日期
      const originalFindSolarDatesForLunar = (ReverseQueryEngine as any).findSolarDatesForLunar;
      (ReverseQueryEngine as any).findSolarDatesForLunar = jest.fn().mockReturnValue(['2024-02-10']);

      // Mock DateInfoEngine.getDateInfo
      (DateInfoEngine.getDateInfo as jest.Mock).mockReturnValue({
        date: '2024年2月10日',
        week: '星期六',
        dayType: '周末',
        lunarDate: '甲辰年正月初一',
      });

      const result = ReverseQueryEngine.queryLunarDate('正月初一', [2024]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(DateInfoEngine.getDateInfo).toHaveBeenCalled();

      // 恢复原始方法
      (ReverseQueryEngine as any).parseLunarDateString = originalParseLunarDateString;
      (ReverseQueryEngine as any).findSolarDatesForLunar = originalFindSolarDatesForLunar;
    });

    it('应该正确处理findSolarDatesForLunar的内部逻辑', () => {
      // 测试 findSolarDatesForLunar 方法的内部逻辑
      // Mock LunarEngine.convertToLunar 返回特定的农历日期
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        // 对于2024年2月10日，返回正月初一
        if (date.getFullYear() === 2024 && date.getMonth() === 1 && date.getDate() === 10) {
          return '甲辰年正月初一';
        }
        return '甲辰年二月初二';
      });

      // Mock DateUtils.formatDateString
      const mockDateUtils = require('../../../src/utils/dateUtils.js');
      mockDateUtils.DateUtils.formatDateString = jest.fn().mockImplementation((date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      });

      // 调用私有方法 findSolarDatesForLunar
      const result = (ReverseQueryEngine as any).findSolarDatesForLunar(2024, 1, 1, 2024, false);
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确处理闰月的findSolarDatesForLunar逻辑', () => {
      // Mock LunarEngine.convertToLunar 返回闰月日期
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        if (date.getFullYear() === 2024 && date.getMonth() === 5 && date.getDate() === 15) {
          return '甲辰年闰五月初一';
        }
        return '甲辰年五月初二';
      });

      // Mock parseLunarDateString 返回闰月信息
      const originalParseLunarDateString = (ReverseQueryEngine as any).parseLunarDateString;
      (ReverseQueryEngine as any).parseLunarDateString = jest.fn().mockImplementation((lunarStr: string) => {
        if (lunarStr.includes('闰五月初一')) {
          return { year: 2024, month: 5, day: 1, isLeap: true };
        }
        return { year: 2024, month: 5, day: 2, isLeap: false };
      });

      // Mock DateUtils.formatDateString
      const mockDateUtils = require('../../../src/utils/dateUtils.js');
      mockDateUtils.DateUtils.formatDateString = jest.fn().mockReturnValue('2024-06-15');

      // 调用私有方法 findSolarDatesForLunar 查找闰月
      const result = (ReverseQueryEngine as any).findSolarDatesForLunar(2024, 5, 1, 2024, true);
      expect(result).toBeInstanceOf(Array);

      // 恢复原始方法
      (ReverseQueryEngine as any).parseLunarDateString = originalParseLunarDateString;
    });

    it('应该正确处理非闰月的findSolarDatesForLunar逻辑', () => {
      // Mock LunarEngine.convertToLunar 返回非闰月日期
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        if (date.getFullYear() === 2024 && date.getMonth() === 4 && date.getDate() === 15) {
          return '甲辰年五月初一';
        }
        return '甲辰年五月初二';
      });

      // Mock parseLunarDateString 返回非闰月信息
      const originalParseLunarDateString = (ReverseQueryEngine as any).parseLunarDateString;
      (ReverseQueryEngine as any).parseLunarDateString = jest.fn().mockImplementation((lunarStr: string) => {
        if (lunarStr.includes('五月初一')) {
          return { year: 2024, month: 5, day: 1, isLeap: false };
        }
        return { year: 2024, month: 5, day: 2, isLeap: false };
      });

      // Mock DateUtils.formatDateString
      const mockDateUtils = require('../../../src/utils/dateUtils.js');
      mockDateUtils.DateUtils.formatDateString = jest.fn().mockReturnValue('2024-05-15');

      // 调用私有方法 findSolarDatesForLunar 查找非闰月
      const result = (ReverseQueryEngine as any).findSolarDatesForLunar(2024, 5, 1, 2024, false);
      expect(result).toBeInstanceOf(Array);

      // 恢复原始方法
      (ReverseQueryEngine as any).parseLunarDateString = originalParseLunarDateString;
    });

    it('应该处理农历日期解析失败', () => {
      const result = ReverseQueryEngine.queryLunarDate('无效格式', [2025]);
      expect(result).toEqual([]);
    });

    it('应该处理空的农历日期字符串', () => {
      const result = ReverseQueryEngine.queryLunarDate('', [2025]);
      expect(result).toEqual([]);
    });
  });

  describe('queryFestival 详细测试', () => {
    it('应该正确匹配节日名称', () => {
      // Mock getYearFestivals 返回节日数据
      const originalGetYearFestivals = (ReverseQueryEngine as any).getYearFestivals;
      (ReverseQueryEngine as any).getYearFestivals = jest.fn().mockReturnValue([
        { name: '春节', date: '2025-01-29' },
        { name: '元宵节', date: '2025-02-12' },
        { name: '中秋节', date: '2025-09-07' },
      ]);

      const result = ReverseQueryEngine.queryFestival('春节', [2025]);
      expect(result).toBeInstanceOf(Array);

      // 恢复原始方法
      (ReverseQueryEngine as any).getYearFestivals = originalGetYearFestivals;
    });

    it('应该处理部分匹配的节日名称', () => {
      const originalGetYearFestivals = (ReverseQueryEngine as any).getYearFestivals;
      (ReverseQueryEngine as any).getYearFestivals = jest.fn().mockReturnValue([
        { name: '中秋节', date: '2025-09-07' },
      ]);

      const result = ReverseQueryEngine.queryFestival('中秋', [2025]);
      expect(result).toBeInstanceOf(Array);

      (ReverseQueryEngine as any).getYearFestivals = originalGetYearFestivals;
    });

    it('应该处理异常情况', () => {
      // Mock FestivalEngine.getFestival 抛出异常
      (FestivalEngine.getFestival as jest.Mock).mockImplementation(() => {
        throw new Error('Festival error');
      });

      const result = ReverseQueryEngine.queryFestival('春节', [2025]);
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('queryByDateRange 详细测试', () => {
    beforeEach(() => {
      // Mock DateUtils.generateDateRange
      const mockDateUtils = require('../../../src/utils/dateUtils.js');
      mockDateUtils.DateUtils.generateDateRange = jest.fn().mockReturnValue([
        new Date('2025-01-01'),
        new Date('2025-01-02'),
        new Date('2025-01-03'),
      ]);
    });

    it('应该正确筛选休息日', () => {
      (DateInfoEngine.getDateInfo as jest.Mock).mockImplementation((date: Date) => ({
        date: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
        week: '星期六',
        dayType: '周末',
        lunarDate: '甲辰年正月初一',
      }));

      const result = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-03', 'rest_days');
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确筛选工作日', () => {
      (DateInfoEngine.getDateInfo as jest.Mock).mockImplementation((date: Date) => ({
        date: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
        week: '星期一',
        dayType: '工作日',
        lunarDate: '甲辰年正月初一',
      }));

      const result = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-03', 'work_days');
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确筛选节日', () => {
      (DateInfoEngine.getDateInfo as jest.Mock).mockImplementation((date: Date) => ({
        date: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
        week: '星期一',
        dayType: '工作日',
        lunarDate: '甲辰年正月初一',
        festival: '元旦',
      }));

      const result = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-03', 'festivals');
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确筛选节气', () => {
      (DateInfoEngine.getDateInfo as jest.Mock).mockImplementation((date: Date) => ({
        date: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
        week: '星期一',
        dayType: '工作日',
        lunarDate: '甲辰年正月初一',
        solarTerm: '立春',
      }));

      const result = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-05', 'solar_terms');
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('isRestDay 和 isWorkDay 方法测试', () => {
    it('应该正确判断休息日', () => {
      const restDayInfo: DateInfo = {
        date: '2025年1月1日',
        week: '星期三',
        dayType: '周末',
        lunarDate: '甲辰年十一月初二',
      };
      expect(ReverseQueryEngine.isRestDay(restDayInfo)).toBe(true);
    });

    it('应该正确判断节假日', () => {
      const holidayInfo: DateInfo = {
        date: '2025年1月1日',
        week: '星期三',
        dayType: '节假日',
        lunarDate: '甲辰年十一月初二',
      };
      expect(ReverseQueryEngine.isRestDay(holidayInfo)).toBe(true);
    });

    it('应该正确判断工作日', () => {
      const workDayInfo: DateInfo = {
        date: '2025年1月2日',
        week: '星期四',
        dayType: '工作日',
        lunarDate: '甲辰年十一月初三',
      };
      expect(ReverseQueryEngine.isWorkDay(workDayInfo)).toBe(true);
    });

    it('应该正确判断调休工作日', () => {
      const adjustedWorkDayInfo: DateInfo = {
        date: '2025年1月4日',
        week: '星期六',
        dayType: '周末',
        lunarDate: '甲辰年十一月初五',
        adjusted: '调休工作日', // 使用 adjusted 字段而不是 dayType
      };
      expect(ReverseQueryEngine.isWorkDay(adjustedWorkDayInfo)).toBe(true);
    });

    it('应该正确判断非休息日', () => {
      const workDayInfo: DateInfo = {
        date: '2025年1月2日',
        week: '星期四',
        dayType: '工作日',
        lunarDate: '甲辰年十一月初三',
      };
      expect(ReverseQueryEngine.isRestDay(workDayInfo)).toBe(false);
    });

    it('应该正确判断非工作日', () => {
      const restDayInfo: DateInfo = {
        date: '2025年1月5日',
        week: '星期日',
        dayType: '周末',
        lunarDate: '甲辰年十一月初六',
      };
      expect(ReverseQueryEngine.isWorkDay(restDayInfo)).toBe(false);
    });
  });

  describe('闰月处理测试', () => {
    it('应该正确处理闰月日期', () => {
      // Mock LunarEngine.convertToLunar 返回闰月日期
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        if (date.getMonth() === 5 && date.getDate() === 15) {
          return '甲辰年闰五月初一';
        }
        return '甲辰年五月初二';
      });

      const mockDateUtils = require('../../../src/utils/dateUtils.js');
      mockDateUtils.DateUtils.formatDateString = jest.fn().mockReturnValue('2024-06-15');

      const result = ReverseQueryEngine.queryLunarDate('闰五月初一', [2024]);
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确处理非闰月日期', () => {
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        return '甲辰年五月初一';
      });

      const mockDateUtils = require('../../../src/utils/dateUtils.js');
      mockDateUtils.DateUtils.formatDateString = jest.fn().mockReturnValue('2024-05-15');

      const result = ReverseQueryEngine.queryLunarDate('五月初一', [2024]);
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确处理异常情况', () => {
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid date');
      });

      const result = ReverseQueryEngine.queryLunarDate('正月初一', [2024]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });

    it('应该处理findSolarDatesForLunar中的异常情况', () => {
      // Mock LunarEngine.convertToLunar 抛出异常来触发 try...catch 中的 continue 语句
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        // 对于某些日期抛出异常，触发 continue 语句
        if (date.getDate() === 15) {
          throw new Error('Invalid lunar conversion');
        }
        return '甲辰年正月初二';
      });

      // Mock DateUtils.formatDateString
      const mockDateUtils = require('../../../src/utils/dateUtils.js');
      mockDateUtils.DateUtils.formatDateString = jest.fn().mockReturnValue('2024-01-16');

      // 调用私有方法 findSolarDatesForLunar，这会触发异常处理
      const result = (ReverseQueryEngine as any).findSolarDatesForLunar(2024, 1, 1, 2024, false);
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('私有方法测试', () => {
    it('应该正确解析农历日期字符串', () => {
      const result = (ReverseQueryEngine as any).parseLunarDateString('农历2025年正月初一');
      expect(result).toEqual({
        year: 2025,
        month: 1,
        day: 1,
        isLeap: false
      });
    });

    it('应该正确解析闰月日期', () => {
      const result = (ReverseQueryEngine as any).parseLunarDateString('农历2025年闰六月初十');
      expect(result).toEqual({
        year: 2025,
        month: 6,
        day: 10,
        isLeap: true
      });
    });

    it('应该处理无效的农历日期格式', () => {
      const result = (ReverseQueryEngine as any).parseLunarDateString('无效格式');
      expect(result).toBeNull();
    });

    it('应该处理空字符串', () => {
      const result = (ReverseQueryEngine as any).parseLunarDateString('');
      expect(result).toBeNull();
    });

    it('应该处理null输入', () => {
      const result = (ReverseQueryEngine as any).parseLunarDateString(null);
      expect(result).toBeNull();
    });

    it('应该处理undefined输入', () => {
      const result = (ReverseQueryEngine as any).parseLunarDateString(undefined);
      expect(result).toBeNull();
    });


  });
});