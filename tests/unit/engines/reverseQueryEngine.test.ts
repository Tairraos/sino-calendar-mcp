import { ReverseQueryEngine } from '../../../src/engines/reverseQueryEngine.js';
import { DateInfoEngine } from '../../../src/engines/dateInfoEngine.js';
import { LunarEngine } from '../../../src/engines/lunarEngine.js';
import { FestivalEngine } from '../../../src/engines/festivalEngine.js';
import { DateUtils } from '../../../src/utils/dateUtils.js';
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

    it('应该正确处理 queryLunarDate 返回多个日期的情况', () => {
      // Mock findSolarDatesForLunar 返回多个日期
      const mockFindSolarDatesForLunar = jest.spyOn(ReverseQueryEngine as any, 'findSolarDatesForLunar');
      mockFindSolarDatesForLunar.mockReturnValue(['2025-02-01', '2025-02-15', '2025-02-28']);

      // Mock parseLunarDateString
      const mockParseLunarDateString = jest.spyOn(ReverseQueryEngine as any, 'parseLunarDateString');
      mockParseLunarDateString.mockReturnValue({
        year: 0,
        month: 1,
        day: 1,
        isLeap: false
      });

      // Mock DateInfoEngine.getDateInfo 为每个日期返回不同的信息
      (DateInfoEngine.getDateInfo as jest.Mock).mockImplementation((date: Date) => ({
        date: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
        week: '星期一',
        dayType: '工作日',
        lunarDate: '甲辰年正月初一',
        festival: undefined,
        solarTerm: undefined,
      }));

      const result = ReverseQueryEngine.queryLunarDate('正月初一', [2025]);
      
      // 验证返回了3个结果（对应3个日期）
      expect(result).toHaveLength(3);
      expect(DateInfoEngine.getDateInfo).toHaveBeenCalledTimes(3);
      
      // 验证每个日期都被正确处理
      expect(DateInfoEngine.getDateInfo).toHaveBeenCalledWith(new Date('2025-02-01'));
      expect(DateInfoEngine.getDateInfo).toHaveBeenCalledWith(new Date('2025-02-15'));
      expect(DateInfoEngine.getDateInfo).toHaveBeenCalledWith(new Date('2025-02-28'));

      mockFindSolarDatesForLunar.mockRestore();
      mockParseLunarDateString.mockRestore();
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

    it('应该正确处理闰月情况', () => {
      // Mock LunarEngine.convertToLunar 返回闰月信息
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        if (dateStr === '2024-06-06') {
          return '农历2024年闰五月初一';
        }
        return '农历2024年五月初一';
      });

      // Mock parseLunarDateString 返回闰月解析结果
      const originalParseLunarDateString = (ReverseQueryEngine as any).parseLunarDateString;
      (ReverseQueryEngine as any).parseLunarDateString = jest.fn().mockImplementation((lunarStr: string) => {
        if (lunarStr.includes('闰五月初一')) {
          return { year: 2024, month: 5, day: 1, isLeap: true };
        }
        return { year: 2024, month: 5, day: 1, isLeap: false };
      });

      // Mock DateUtils.formatDateString
      (DateUtils.formatDateString as jest.Mock).mockImplementation((date: Date) => {
        return date.toISOString().split('T')[0];
      });

      // 测试闰月查找
      const result = (ReverseQueryEngine as any).findSolarDatesForLunar(2024, 5, 1, 2024, true);
      expect(result).toBeInstanceOf(Array);

      // 恢复原始方法
      (ReverseQueryEngine as any).parseLunarDateString = originalParseLunarDateString;
    });

    it('应该正确处理非闰月情况', () => {
      // Mock LunarEngine.convertToLunar 返回非闰月信息
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        return '农历2024年五月初一';
      });

      // Mock parseLunarDateString 返回非闰月解析结果
      const originalParseLunarDateString = (ReverseQueryEngine as any).parseLunarDateString;
      (ReverseQueryEngine as any).parseLunarDateString = jest.fn().mockReturnValue({
        year: 2024, month: 5, day: 1, isLeap: false
      });

      // Mock DateUtils.formatDateString
      (DateUtils.formatDateString as jest.Mock).mockImplementation((date: Date) => {
        return date.toISOString().split('T')[0];
      });

      // 测试非闰月查找
      const result = (ReverseQueryEngine as any).findSolarDatesForLunar(2024, 5, 1, 2024, false);
      expect(result).toBeInstanceOf(Array);

      // 恢复原始方法
      (ReverseQueryEngine as any).parseLunarDateString = originalParseLunarDateString;
    });

    it('应该处理 findSolarDatesForLunar 中的异常情况', () => {
      // Mock LunarEngine.convertToLunar 抛出异常
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid date');
      });

      // 测试异常处理
      const result = (ReverseQueryEngine as any).findSolarDatesForLunar(2024, 1, 1, 2024, false);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });


  });

  describe('queryLunarDate 详细测试', () => {
    it('应该处理有效的农历日期并返回结果', () => {
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

    it('应该处理 DateUtils.generateDateRange 返回非数组的情况', () => {
      // Mock DateUtils.generateDateRange 返回非数组
      const mockDateUtils = require('../../../src/utils/dateUtils.js');
      mockDateUtils.DateUtils.generateDateRange = jest.fn().mockReturnValue(null);

      const result = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-03', 'rest_days');
      
      // 应该返回空数组
      expect(result).toEqual([]);
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确处理所有类型分支并筛选匹配的日期', () => {
      // 重置 DateUtils.generateDateRange mock
      const mockDateUtils = require('../../../src/utils/dateUtils.js');
      mockDateUtils.DateUtils.generateDateRange = jest.fn().mockReturnValue([
        new Date('2025-01-01'),
        new Date('2025-01-02'),
        new Date('2025-01-03'),
        new Date('2025-01-04'),
      ]);

      // Mock DateInfoEngine.getDateInfo 返回不同类型的日期信息
      (DateInfoEngine.getDateInfo as jest.Mock).mockImplementation((date: Date) => {
        const day = date.getDate();
        return {
          date: `${date.getFullYear()}年${date.getMonth() + 1}月${day}日`,
          week: day === 1 ? '星期六' : '星期一',
          dayType: day === 1 ? '周末' : '工作日',
          lunarDate: '甲辰年正月初一',
          festival: day === 2 ? '元旦' : undefined,
          solarTerm: day === 3 ? '立春' : undefined,
        };
      });

      // 测试 rest_days 分支
      const restDaysResult = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-04', 'rest_days');
      expect(restDaysResult).toHaveLength(1); // 只有1月1日是休息日

      // 测试 work_days 分支
      const workDaysResult = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-04', 'work_days');
      expect(workDaysResult).toHaveLength(3); // 1月2日、3日、4日是工作日

      // 测试 festivals 分支
      const festivalsResult = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-04', 'festivals');
      expect(festivalsResult).toHaveLength(1); // 只有1月2日有节日

      // 测试 solar_terms 分支
      const solarTermsResult = ReverseQueryEngine.queryByDateRange('2025-01-01', '2025-01-04', 'solar_terms');
      expect(solarTermsResult).toHaveLength(1); // 只有1月3日有节气
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

    it('应该正确获取节气索引', () => {
      // 测试有效的节气名称
      const springIndex = (ReverseQueryEngine as any).getSolarTermIndex('立春');
      expect(springIndex).toBe(0);
      
      const summerSolsticeIndex = (ReverseQueryEngine as any).getSolarTermIndex('夏至');
      expect(summerSolsticeIndex).toBe(9);
      
      const winterSolsticeIndex = (ReverseQueryEngine as any).getSolarTermIndex('冬至');
      expect(winterSolsticeIndex).toBe(21);
      
      // 测试无效的节气名称
      const invalidIndex = (ReverseQueryEngine as any).getSolarTermIndex('无效节气');
      expect(invalidIndex).toBe(-1);
    });

    it('应该正确获取年度节日列表', () => {
      // Mock FestivalEngine.getFestival 返回节日信息
      (FestivalEngine.getFestival as jest.Mock).mockImplementation((date: Date) => {
        if (date.getMonth() === 0 && date.getDate() === 1) {
          return '元旦';
        }
        if (date.getMonth() === 9 && date.getDate() === 1) {
          return '国庆节';
        }
        return undefined;
      });

      const festivals = (ReverseQueryEngine as any).getYearFestivals(2025);
      
      expect(festivals).toBeInstanceOf(Array);
      expect(festivals.length).toBeGreaterThan(0);
      
      // 验证返回的节日格式
      const firstFestival = festivals[0];
      expect(firstFestival).toHaveProperty('name');
      expect(firstFestival).toHaveProperty('date');
      expect(typeof firstFestival.name).toBe('string');
      expect(typeof firstFestival.date).toBe('string');
    });

    it('应该处理获取年度节日时的异常情况', () => {
      // Mock FestivalEngine.getFestival 抛出异常
      (FestivalEngine.getFestival as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });
    
      const festivals = (ReverseQueryEngine as any).getYearFestivals(2025);
      
      // 即使有异常，也应该返回数组
      expect(festivals).toBeInstanceOf(Array);
    });
  });

  describe('findSolarDatesForLunar 闰月处理测试', () => {
    let originalParseLunarDateString: any;
    let originalConvertToLunar: any;
    let originalFormatDateString: any;

    beforeEach(() => {
      // 保存原始方法
      originalParseLunarDateString = (ReverseQueryEngine as any).parseLunarDateString;
      originalConvertToLunar = LunarEngine.convertToLunar;
      originalFormatDateString = DateUtils.formatDateString;
    });

    afterEach(() => {
      // 恢复原始方法
      (ReverseQueryEngine as any).parseLunarDateString = originalParseLunarDateString;
      (LunarEngine.convertToLunar as jest.Mock) = originalConvertToLunar;
      (DateUtils.formatDateString as jest.Mock) = originalFormatDateString;
    });

    it('应该正确处理闰月查找逻辑', () => {
      // Mock DateUtils.formatDateString
      (DateUtils.formatDateString as jest.Mock).mockImplementation((date: Date) => {
        return date.toISOString().split('T')[0];
      });

      // Mock LunarEngine.convertToLunar 返回闰月信息
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        if (date.getMonth() === 0 && date.getDate() === 14) {
          return '农历2024年闰五月初一';
        }
        return '农历2024年五月初二';
      });

      // Mock parseLunarDateString
      (ReverseQueryEngine as any).parseLunarDateString = jest.fn().mockImplementation((lunarStr: string) => {
        if (!lunarStr) return null;
        if (lunarStr.includes('闰五月初一')) {
          return { year: 2024, month: 5, day: 1, isLeap: true };
        }
        return { year: 2024, month: 5, day: 2, isLeap: false };
      });

      // 查找闰月，应该只返回闰月日期
      const leapResult = (ReverseQueryEngine as any).findSolarDatesForLunar(2024, 5, 1, 2024, true);
      expect(leapResult).toBeInstanceOf(Array);
      expect(leapResult.length).toBeGreaterThan(0);
    });

    it('应该正确处理非闰月查找逻辑', () => {
      // Mock DateUtils.formatDateString
      (DateUtils.formatDateString as jest.Mock).mockImplementation((date: Date) => {
        return date.toISOString().split('T')[0];
      });

      // Mock LunarEngine.convertToLunar
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation((date: Date) => {
        if (date.getMonth() === 0 && date.getDate() === 9) {
          return '农历2024年五月初一';
        }
        return '农历2024年五月初二';
      });

      // Mock parseLunarDateString
      (ReverseQueryEngine as any).parseLunarDateString = jest.fn().mockImplementation((lunarStr: string) => {
        if (!lunarStr) return null;
        if (lunarStr.includes('五月初一')) {
          return { year: 2024, month: 5, day: 1, isLeap: false };
        }
        return { year: 2024, month: 5, day: 2, isLeap: false };
      });

      // 查找非闰月，应该返回匹配的日期
      const nonLeapResult = (ReverseQueryEngine as any).findSolarDatesForLunar(2024, 5, 1, 2024, false);
      expect(nonLeapResult).toBeInstanceOf(Array);
      expect(nonLeapResult.length).toBeGreaterThan(0);
    });
  });
});