import { DateInfoEngine } from '../../../src/engines/dateInfoEngine.js';
import { LunarEngine } from '../../../src/engines/lunarEngine.js';
import { SolarTermEngine } from '../../../src/engines/solarTermEngine.js';
import { FestivalEngine } from '../../../src/engines/festivalEngine.js';
import { WorkdayEngine } from '../../../src/engines/workdayEngine.js';
import { DateUtils } from '../../../src/utils/dateUtils.js';

// Mock all dependencies
jest.mock('../../../src/engines/lunarEngine.js');
jest.mock('../../../src/engines/solarTermEngine.js');
jest.mock('../../../src/engines/festivalEngine.js');
jest.mock('../../../src/engines/workdayEngine.js');
jest.mock('../../../src/utils/dateUtils.js');

describe('DateInfoEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock console.error to avoid noise in test output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock DateUtils methods
    (DateUtils.formatChineseDate as jest.Mock).mockImplementation(
      (date: Date) => `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
    );
    (DateUtils.formatChineseWeek as jest.Mock).mockImplementation(() => '星期三');
    (DateUtils.generateDateRange as jest.Mock).mockImplementation((start: Date, end: Date) => {
      const dates = [];
      const current = new Date(start);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getDateInfo', () => {
    it('应该正确获取日期信息', () => {
      // Mock all dependencies to return valid data
      (LunarEngine.convertToLunar as jest.Mock).mockReturnValue('农历2025年正月初一');
      (SolarTermEngine.getSolarTerm as jest.Mock).mockReturnValue('立春');
      (FestivalEngine.getFestival as jest.Mock).mockReturnValue('春节');
      (WorkdayEngine.getDayType as jest.Mock).mockReturnValue({ dayType: '节假日' });

      const date = new Date('2025-01-29');
      const result = DateInfoEngine.getDateInfo(date);

      expect(result).toBeDefined();
      expect(result.date).toBeDefined();
      expect(result.week).toBeDefined();
      expect(result.dayType).toBeDefined();
      expect(result.lunarDate).toBeDefined();
    });

    it('应该处理LunarEngine异常并返回基本信息', () => {
      // Mock LunarEngine to throw an error
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation(() => {
        throw new Error('LunarEngine error');
      });

      // Mock other engines to return valid data
      (SolarTermEngine.getSolarTerm as jest.Mock).mockReturnValue(null);
      (FestivalEngine.getFestival as jest.Mock).mockReturnValue(null);
      (WorkdayEngine.getDayType as jest.Mock).mockReturnValue({ dayType: '工作日' });

      const date = new Date('2025-01-29');
      const result = DateInfoEngine.getDateInfo(date);

      expect(result).toBeDefined();
      expect(result.date).toBeDefined();
      expect(result.week).toBeDefined();
      expect(result.dayType).toBe('工作日');
      expect(result.lunarDate).toBe('农历信息获取失败');
    });

    it('应该处理SolarTermEngine异常', () => {
      // Mock LunarEngine to return valid data
      (LunarEngine.convertToLunar as jest.Mock).mockReturnValue('农历2025年正月初一');

      // Mock SolarTermEngine to throw an error
      (SolarTermEngine.getSolarTerm as jest.Mock).mockImplementation(() => {
        throw new Error('SolarTermEngine error');
      });

      // Mock other engines to return valid data
      (FestivalEngine.getFestival as jest.Mock).mockReturnValue(null);
      (WorkdayEngine.getDayType as jest.Mock).mockReturnValue({ dayType: '工作日' });

      const date = new Date('2025-01-29');
      const result = DateInfoEngine.getDateInfo(date);

      expect(result).toBeDefined();
      expect(result.date).toBeDefined();
      expect(result.week).toBeDefined();
      expect(result.dayType).toBe('工作日');
      expect(result.lunarDate).toBe('农历2025年正月初一');
      expect(result.solarTerm).toBeUndefined();
    });

    it('应该处理FestivalEngine异常', () => {
      // Mock LunarEngine to return valid data
      (LunarEngine.convertToLunar as jest.Mock).mockReturnValue('农历2025年正月初一');

      // Mock SolarTermEngine to return valid data
      (SolarTermEngine.getSolarTerm as jest.Mock).mockReturnValue(null);

      // Mock FestivalEngine to throw an error
      (FestivalEngine.getFestival as jest.Mock).mockImplementation(() => {
        throw new Error('FestivalEngine error');
      });

      // Mock WorkdayEngine to return valid data
      (WorkdayEngine.getDayType as jest.Mock).mockReturnValue({ dayType: '工作日' });

      const date = new Date('2025-01-29');
      const result = DateInfoEngine.getDateInfo(date);

      expect(result).toBeDefined();
      expect(result.date).toBeDefined();
      expect(result.week).toBeDefined();
      expect(result.dayType).toBe('工作日');
      expect(result.lunarDate).toBe('农历2025年正月初一');
      expect(result.festival).toBeUndefined();
    });

    it('应该处理WorkdayEngine异常', () => {
      // Mock LunarEngine to return valid data
      (LunarEngine.convertToLunar as jest.Mock).mockReturnValue('农历2025年正月初一');

      // Mock SolarTermEngine to return valid data
      (SolarTermEngine.getSolarTerm as jest.Mock).mockReturnValue(null);

      // Mock FestivalEngine to return valid data
      (FestivalEngine.getFestival as jest.Mock).mockReturnValue(null);

      // Mock WorkdayEngine to throw an error
      (WorkdayEngine.getDayType as jest.Mock).mockImplementation(() => {
        throw new Error('WorkdayEngine error');
      });

      const date = new Date('2025-01-29');
      const result = DateInfoEngine.getDateInfo(date);

      expect(result).toBeDefined();
      expect(result.date).toBeDefined();
      expect(result.week).toBeDefined();
      expect(result.dayType).toBe('工作日');
      expect(result.lunarDate).toBe('农历2025年正月初一');
    });

    it('应该处理多个引擎同时异常', () => {
      // Mock all engines to throw errors
      (LunarEngine.convertToLunar as jest.Mock).mockImplementation(() => {
        throw new Error('LunarEngine error');
      });
      (SolarTermEngine.getSolarTerm as jest.Mock).mockImplementation(() => {
        throw new Error('SolarTermEngine error');
      });
      (FestivalEngine.getFestival as jest.Mock).mockImplementation(() => {
        throw new Error('FestivalEngine error');
      });
      (WorkdayEngine.getDayType as jest.Mock).mockImplementation(() => {
        throw new Error('WorkdayEngine error');
      });

      const date = new Date('2025-01-29');
      const result = DateInfoEngine.getDateInfo(date);

      expect(result).toBeDefined();
      expect(result.date).toBeDefined();
      expect(result.week).toBeDefined();
      expect(result.dayType).toBe('工作日');
      expect(result.lunarDate).toBe('农历信息获取失败');
    });

    it('应该处理DateUtils异常并返回基本信息', () => {
      // First, reset all mocks to ensure clean state
      jest.clearAllMocks();

      // Mock DateUtils.formatChineseDate to throw an error to trigger catch block
      (DateUtils.formatChineseDate as jest.Mock)
        .mockImplementationOnce(() => {
          throw new Error('DateUtils error');
        })
        .mockImplementation(
          (date: Date) => `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
        );

      // Mock other DateUtils methods to work normally
      (DateUtils.formatChineseWeek as jest.Mock).mockImplementation(() => '星期三');

      // Mock console.error to avoid noise in test output
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const date = new Date('2025-01-29');
      const result = DateInfoEngine.getDateInfo(date);

      expect(result).toBeDefined();
      expect(result.date).toBeDefined();
      expect(result.week).toBeDefined();
      expect(result.dayType).toBe('工作日');
      expect(result.lunarDate).toBe('农历信息获取失败');
      expect(console.error).toHaveBeenCalledWith('获取日期信息失败:', expect.any(Error));
    });
  });

  describe('getDateRangeInfo', () => {
    it('应该正确获取日期范围信息', () => {
      // Mock getDateInfo to return valid data
      const mockDateInfo = {
        date: '2025年1月1日',
        week: '星期三',
        dayType: '节假日',
        lunarDate: '农历2024年十二月初二',
        festival: '元旦',
      };

      jest.spyOn(DateInfoEngine, 'getDateInfo').mockReturnValue(mockDateInfo);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-03');
      const result = DateInfoEngine.getDateRangeInfo(startDate, endDate);

      expect(result).toBeDefined();
      expect(result.dates).toBeDefined();
      expect(Array.isArray(result.dates)).toBe(true);
    });
  });

  describe('getDateStatistics', () => {
    it('应该正确获取日期统计信息', () => {
      // Mock all dependencies for getDateInfo
      (LunarEngine.convertToLunar as jest.Mock).mockReturnValue('农历2025年正月十六');
      (SolarTermEngine.getSolarTerm as jest.Mock).mockReturnValue(null);
      (FestivalEngine.getFestival as jest.Mock).mockReturnValue(null);
      (WorkdayEngine.getDayType as jest.Mock).mockReturnValue({ dayType: '工作日' });

      // Mock WorkdayEngine methods for statistics
      (WorkdayEngine.isWorkday as jest.Mock).mockReturnValue(true);
      (WorkdayEngine.isHoliday as jest.Mock).mockReturnValue(false);
      (WorkdayEngine.isAdjusted as jest.Mock).mockReturnValue(false);
      (WorkdayEngine.getYearHolidays as jest.Mock).mockReturnValue([]);
      (WorkdayEngine.getYearWorkingDays as jest.Mock).mockReturnValue([]);

      // Mock additional methods for statistics
      (DateUtils.isWeekend as jest.Mock).mockReturnValue(false);
      (SolarTermEngine.isSolarTerm as jest.Mock).mockReturnValue(false);
      (LunarEngine.isLeapMonth as jest.Mock).mockReturnValue(false);

      const date = new Date('2025-01-15');
      const result = DateInfoEngine.getDateStatistics(date);

      expect(result).toBeDefined();
      expect(result.date).toBeDefined();
      expect(result.week).toBeDefined();
      expect(result.dayType).toBeDefined();
      expect(result.lunarDate).toBeDefined();
      expect(result.statistics).toBeDefined();
      expect(typeof result.statistics.isWorkday).toBe('boolean');
      expect(typeof result.statistics.isHoliday).toBe('boolean');
      expect(typeof result.statistics.isAdjusted).toBe('boolean');
      expect(typeof result.statistics.isWeekend).toBe('boolean');
      expect(typeof result.statistics.isSolarTerm).toBe('boolean');
      expect(typeof result.statistics.isLeapMonth).toBe('boolean');
      expect(typeof result.statistics.yearHolidaysCount).toBe('number');
      expect(typeof result.statistics.yearWorkingDaysCount).toBe('number');
    });
  });

  describe('getMonthFestivals', () => {
    it('应该正确获取月份节日信息', () => {
      // Mock FestivalEngine.getFestival to return festival data
      (FestivalEngine.getFestival as jest.Mock).mockImplementation((date: Date) => {
        if (date.getDate() === 1) return '元旦';
        return null;
      });

      const result = DateInfoEngine.getMonthFestivals(2025, 1);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getYearSolarTerms', () => {
    it('应该正确获取年份节气信息', () => {
      // Mock SolarTermEngine.getYearSolarTerms to return Map
      const mockSolarTermsMap = new Map([
        ['立春', new Date('2025-02-04')],
        ['雨水', new Date('2025-02-19')],
      ]);
      (SolarTermEngine.getYearSolarTerms as jest.Mock).mockReturnValue(mockSolarTermsMap);

      const result = DateInfoEngine.getYearSolarTerms(2025);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getSurroundingInfo', () => {
    it('应该正确获取周围日期信息', () => {
      // Mock getDateInfo to return valid data
      const mockDateInfo = {
        date: '2025年1月15日',
        week: '星期三',
        dayType: '工作日',
        lunarDate: '农历2024年十二月十六',
      };

      jest.spyOn(DateInfoEngine, 'getDateInfo').mockReturnValue(mockDateInfo);

      const date = new Date('2025-01-15');
      const result = DateInfoEngine.getSurroundingInfo(date, 3);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.centerDate).toBeDefined();
      expect(result.surroundingDates).toBeDefined();
      expect(Array.isArray(result.surroundingDates)).toBe(true);
      expect(typeof result.totalDays).toBe('number');
    });
  });
});
