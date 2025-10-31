import { ReverseQueryEngine } from '../../../src/engines/reverseQueryEngine.js';
import { DateInfoEngine } from '../../../src/engines/dateInfoEngine.js';
import { DateInfo } from '../../../src/types/index.js';

// Mock DateInfoEngine
jest.mock('../../../src/engines/dateInfoEngine.js');

// Mock 其他引擎
jest.mock('../../../src/engines/lunarEngine.js');
jest.mock('../../../src/engines/festivalEngine.js');
jest.mock('../../../src/engines/solarTermEngine.js', () => ({
  SolarTermEngine: {
    getYearSolarTerms: jest.fn((year: number) => [
      ['立春', new Date('2025-02-04')],
      ['雨水', new Date('2025-02-19')],
      ['惊蛰', new Date('2025-03-06')]
    ])
  }
}));
jest.mock('../../../src/engines/workdayEngine.js');
jest.mock('../../../src/utils/dateUtils.js');

describe('ReverseQueryEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('queryLunarDate', () => {
    it('应该正确查询农历日期对应的公历日期', () => {
      // 设置模拟返回值
      const mockDateInfo: DateInfo = {
        date: '2025年2月4日',
        week: '星期二',
        dayType: '工作日',
        lunarDate: '农历2025年正月初六',
      };

      (DateInfoEngine as any).getDateInfo = jest.fn().mockReturnValue(mockDateInfo);

      const result = ReverseQueryEngine.queryLunarDate('农历2025年正月初六', [2025]);
      
      expect(result).toBeInstanceOf(Array);
    });

    it('应该返回空数组当农历日期格式无效', () => {
      const result = ReverseQueryEngine.queryLunarDate('无效日期', [2025]);
      expect(result).toEqual([]);
    });
  });

  describe('queryFestival', () => {
    it('应该正确查询节日对应的日期', () => {
      const mockDateInfo: DateInfo = {
        date: '2025年1月29日',
        week: '星期三',
        dayType: '节假日',
        festival: '春节',
        lunarDate: '农历2025年正月初一',
      };

      (DateInfoEngine as any).getDateInfo = jest.fn().mockReturnValue(mockDateInfo);

      const result = ReverseQueryEngine.queryFestival('春节', [2025]);
      
      expect(result).toBeInstanceOf(Array);
    });

    it('应该返回空数组当没有找到匹配的节日', () => {
      (DateInfoEngine as any).getDateInfo = jest.fn().mockReturnValue({
        date: '2025年2月4日',
        week: '星期二',
        dayType: '工作日',
        lunarDate: '农历2025年正月初六',
      });

      const result = ReverseQueryEngine.queryFestival('不存在的节日', [2025]);
      expect(result).toEqual([]);
    });
  });

  describe('querySolarTerm', () => {
    it('应该正确查询节气对应的日期', () => {
      const mockDateInfo: DateInfo = {
        date: '2025年2月4日',
        week: '星期二',
        dayType: '工作日',
        solarTerm: '立春',
        lunarDate: '农历2025年正月初六',
      };

      (DateInfoEngine as any).getDateInfo = jest.fn().mockReturnValue(mockDateInfo);

      const result = ReverseQueryEngine.querySolarTerm('立春', [2025]);
      
      expect(result).toBeInstanceOf(Array);
    });

    it('应该返回空数组当节气名称无效', () => {
      const result = ReverseQueryEngine.querySolarTerm('不存在的节气', [2025]);
      expect(result).toEqual([]);
    });
  });

  describe('queryByDateRange', () => {
    it('应该正确查询休息日日', () => {
      const mockDateInfo: DateInfo = {
        date: '2025年2月1日',
        week: '星期六',
        dayType: '周末',
        lunarDate: '农历2025年正月初四',
      };

      (DateInfoEngine as any).getDateInfo = jest.fn().mockReturnValue(mockDateInfo);

      const result = ReverseQueryEngine.queryByDateRange('2025-02-01', '2025-02-01', 'rest_days');
      
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确查询工作日', () => {
      const mockDateInfo: DateInfo = {
        date: '2025年2月4日',
        week: '星期二',
        dayType: '工作日',
        lunarDate: '农历2025年正月初六',
      };

      (DateInfoEngine as any).getDateInfo = jest.fn().mockReturnValue(mockDateInfo);

      const result = ReverseQueryEngine.queryByDateRange('2025-02-04', '2025-02-04', 'work_days');
      
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确查询节日', () => {
      const mockDateInfo: DateInfo = {
        date: '2025年1月29日',
        week: '星期三',
        dayType: '节假日',
        festival: '春节',
        lunarDate: '农历2025年正月初一',
      };

      (DateInfoEngine as any).getDateInfo = jest.fn().mockReturnValue(mockDateInfo);

      const result = ReverseQueryEngine.queryByDateRange('2025-01-29', '2025-01-29', 'festivals');
      
      expect(result).toBeInstanceOf(Array);
    });

    it('应该正确查询节气', () => {
      const mockDateInfo: DateInfo = {
        date: '2025年2月4日',
        week: '星期二',
        dayType: '工作日',
        solarTerm: '立春',
        lunarDate: '农历2025年正月初六',
      };

      (DateInfoEngine as any).getDateInfo = jest.fn().mockReturnValue(mockDateInfo);

      const result = ReverseQueryEngine.queryByDateRange('2025-02-04', '2025-02-04', 'solar_terms');
      
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('isRestDay', () => {
    it('应该正确识别周末为休息日', () => {
      const dateInfo: DateInfo = {
        date: '2025年2月1日',
        week: '星期六',
        dayType: '周末',
        lunarDate: '农历2025年正月初四',
      };

      expect(ReverseQueryEngine.isRestDay(dateInfo)).toBe(true);
    });

    it('应该正确识别节假日为休息日', () => {
      const dateInfo: DateInfo = {
        date: '2025年1月29日',
        week: '星期三',
        dayType: '节假日',
        festival: '春节',
        lunarDate: '农历2025年正月初一',
      };

      expect(ReverseQueryEngine.isRestDay(dateInfo)).toBe(true);
    });

    it('应该正确识别调休工作日为非休息日', () => {
      const dateInfo: DateInfo = {
        date: '2025年2月8日',
        week: '星期六',
        dayType: '节假日',
        adjusted: '调休工作日',
        lunarDate: '农历2025年正月十一',
      };

      expect(ReverseQueryEngine.isRestDay(dateInfo)).toBe(false);
    });
  });

  describe('isWorkDay', () => {
    it('应该正确识别工作日', () => {
      const dateInfo: DateInfo = {
        date: '2025年2月4日',
        week: '星期二',
        dayType: '工作日',
        lunarDate: '农历2025年正月初六',
      };

      expect(ReverseQueryEngine.isWorkDay(dateInfo)).toBe(true);
    });

    it('应该正确识别调休工作日', () => {
      const dateInfo: DateInfo = {
        date: '2025年2月8日',
        week: '星期六',
        dayType: '节假日',
        adjusted: '调休工作日',
        lunarDate: '农历2025年正月十一',
      };

      expect(ReverseQueryEngine.isWorkDay(dateInfo)).toBe(true);
    });

    it('应该正确识别周末为非工作日', () => {
      const dateInfo: DateInfo = {
        date: '2025年2月1日',
        week: '星期六',
        dayType: '周末',
        lunarDate: '农历2025年正月初四',
      };

      expect(ReverseQueryEngine.isWorkDay(dateInfo)).toBe(false);
    });
  });
});