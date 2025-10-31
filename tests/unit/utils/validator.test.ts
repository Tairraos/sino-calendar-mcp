import { Validator } from '../../../src/utils/validator';

describe('Validator', () => {
  describe('validateDateString', () => {
    it('should validate correct date strings', () => {
      const result = Validator.validateDateString('2025-01-01');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid date format', () => {
      const result = Validator.validateDateString('01/01/2025');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('格式');
    });

    it('should reject empty strings', () => {
      const result = Validator.validateDateString('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('空');
    });

    it('should reject non-string inputs', () => {
      const result = Validator.validateDateString(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('字符串');
    });

    it('should reject invalid dates', () => {
      const result = Validator.validateDateString('2025-02-30');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('不存在');
    });

    it('should reject whitespace-only strings', () => {
      const result = Validator.validateDateString('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('空');
    });

    it('should reject years outside valid range', () => {
      const result1 = Validator.validateDateString('1899-01-01');
      expect(result1.isValid).toBe(false);
      expect(result1.error).toContain('年份必须在1900-2100之间');

      const result2 = Validator.validateDateString('2101-01-01');
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('年份必须在1900-2100之间');
    });

    it('should reject invalid months', () => {
      const result1 = Validator.validateDateString('2025-00-01');
      expect(result1.isValid).toBe(false);
      expect(result1.error).toContain('月份必须在1-12之间');

      const result2 = Validator.validateDateString('2025-13-01');
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('月份必须在1-12之间');
    });

    it('should reject invalid days', () => {
      const result1 = Validator.validateDateString('2025-01-00');
      expect(result1.isValid).toBe(false);
      expect(result1.error).toContain('日期必须在1-31之间');

      const result2 = Validator.validateDateString('2025-01-32');
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('日期必须在1-31之间');
    });

    it('should handle leap year dates correctly', () => {
      const result1 = Validator.validateDateString('2024-02-29'); // 2024 is leap year
      expect(result1.isValid).toBe(true);

      const result2 = Validator.validateDateString('2025-02-29'); // 2025 is not leap year
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('不存在');
    });
  });

  describe('validateDateRange', () => {
    it('should validate correct date ranges', () => {
      const result = Validator.validateDateRange('2025-01-01', '2025-01-31');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject when start date is after end date', () => {
      const result = Validator.validateDateRange('2025-01-31', '2025-01-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('开始日期不能晚于结束日期');
    });

    it('should reject invalid start date', () => {
      const result = Validator.validateDateRange('invalid', '2025-01-31');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('开始日期');
    });

    it('should reject invalid end date', () => {
      const result = Validator.validateDateRange('2025-01-01', 'invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('结束日期');
    });

    it('should allow same start and end date', () => {
      const result = Validator.validateDateRange('2025-01-01', '2025-01-01');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject date ranges exceeding 366 days', () => {
      const result = Validator.validateDateRange('2025-01-01', '2026-01-03'); // More than 366 days (367 days)
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('查询范围不能超过366天');
    });

    it('should allow exactly 366 days range', () => {
      const result = Validator.validateDateRange('2024-01-01', '2024-12-31'); // Exactly 365 days in 2024 (leap year)
      expect(result.isValid).toBe(true);
    });

    it('should handle cross-year date ranges', () => {
      const result = Validator.validateDateRange('2024-12-01', '2025-01-31');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validateToolArgs', () => {
    it('should validate get_date_info tool arguments', () => {
      const result = Validator.validateToolArgs('get_date_info', { date: '2025-01-01' });
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate get_date_range_info tool arguments', () => {
      const result = Validator.validateToolArgs('get_date_range_info', {
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      });
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject unknown tool names', () => {
      const result = Validator.validateToolArgs('unknown_tool', {});
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('未知的工具');
    });

    it('should reject invalid arguments for get_date_info', () => {
      const result = Validator.validateToolArgs('get_date_info', { date: 'invalid' });
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject null or undefined arguments', () => {
      const result1 = Validator.validateToolArgs('get_date_info', null);
      expect(result1.isValid).toBe(false);
      expect(result1.error).toContain('参数必须是对象类型');

      const result2 = Validator.validateToolArgs('get_date_info', undefined);
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('参数必须是对象类型');
    });

    it('should reject non-object arguments', () => {
      const result = Validator.validateToolArgs('get_date_info', 'not an object');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('参数必须是对象类型');
    });

    it('should reject get_date_info without date parameter', () => {
      const result = Validator.validateToolArgs('get_date_info', {});
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('缺少必需参数: date');
    });

    it('should reject get_date_range_info without startDate parameter', () => {
      const result = Validator.validateToolArgs('get_date_range_info', { endDate: '2025-01-31' });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('缺少必需参数: startDate');
    });

    it('should reject get_date_range_info without endDate parameter', () => {
      const result = Validator.validateToolArgs('get_date_range_info', { startDate: '2025-01-01' });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('缺少必需参数: endDate');
    });

    it('should reject get_date_range_info with invalid date range', () => {
      const result = Validator.validateToolArgs('get_date_range_info', {
        startDate: '2025-01-31',
        endDate: '2025-01-01',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('开始日期不能晚于结束日期');
    });
  });

  describe('validateYear', () => {
    it('should validate correct years', () => {
      const result = Validator.validateYear(2025);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject years outside valid range', () => {
      const result = Validator.validateYear(1800);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('年份');
    });

    it('should reject non-number inputs', () => {
      const result = Validator.validateYear('2025');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('数字');
    });

    it('should validate boundary years', () => {
      const result1 = Validator.validateYear(1900);
      expect(result1.isValid).toBe(true);

      const result2 = Validator.validateYear(2100);
      expect(result2.isValid).toBe(true);

      const result3 = Validator.validateYear(1899);
      expect(result3.isValid).toBe(false);
      expect(result3.error).toContain('年份必须在1900-2100之间');

      const result4 = Validator.validateYear(2101);
      expect(result4.isValid).toBe(false);
      expect(result4.error).toContain('年份必须在1900-2100之间');
    });

    it('should reject non-integer numbers', () => {
      const result = Validator.validateYear(2025.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('年份必须是整数');
    });

    it('should reject null and undefined', () => {
      const result1 = Validator.validateYear(null);
      expect(result1.isValid).toBe(false);
      expect(result1.error).toContain('年份必须是数字类型');

      const result2 = Validator.validateYear(undefined);
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('年份必须是数字类型');
    });
  });

  describe('validateMonth', () => {
    it('should validate correct months', () => {
      const result = Validator.validateMonth(1);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject months outside valid range', () => {
      const result = Validator.validateMonth(13);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('月份');
    });

    it('should reject non-number inputs', () => {
      const result = Validator.validateMonth('1');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('数字');
    });

    it('should validate boundary months', () => {
      const result1 = Validator.validateMonth(1);
      expect(result1.isValid).toBe(true);

      const result2 = Validator.validateMonth(12);
      expect(result2.isValid).toBe(true);

      const result3 = Validator.validateMonth(0);
      expect(result3.isValid).toBe(false);
      expect(result3.error).toContain('月份必须在1-12之间');

      const result4 = Validator.validateMonth(13);
      expect(result4.isValid).toBe(false);
      expect(result4.error).toContain('月份必须在1-12之间');
    });

    it('should reject non-integer numbers', () => {
      const result = Validator.validateMonth(1.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('月份必须是整数');
    });

    it('should reject null and undefined', () => {
      const result1 = Validator.validateMonth(null);
      expect(result1.isValid).toBe(false);
      expect(result1.error).toContain('月份必须是数字类型');

      const result2 = Validator.validateMonth(undefined);
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('月份必须是数字类型');
    });

    it('should validate all valid months', () => {
      for (let month = 1; month <= 12; month++) {
        const result = Validator.validateMonth(month);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      }
    });
  });

  describe('validateLunarDateString', () => {
    it('should validate correct lunar date strings', () => {
      const result = Validator.validateLunarDateString('农历2025年正月初一');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate lunar date strings with leap month', () => {
      const result = Validator.validateLunarDateString('农历2025年闰四月十五');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject non-string inputs', () => {
      const result = Validator.validateLunarDateString(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('农历日期必须是字符串类型');
    });

    it('should reject empty strings', () => {
      const result = Validator.validateLunarDateString('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('农历日期不能为空');
    });

    it('should reject invalid lunar date format', () => {
      const result = Validator.validateLunarDateString('2025年正月初一');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('农历日期格式无效');
    });
  });

  describe('validateFestivalName', () => {
    it('should validate correct festival names', () => {
      const result1 = Validator.validateFestivalName('春节');
      expect(result1.isValid).toBe(true);
      expect(result1.error).toBeUndefined();

      const result2 = Validator.validateFestivalName('元宵节');
      expect(result2.isValid).toBe(true);
      expect(result2.error).toBeUndefined();

      const result3 = Validator.validateFestivalName('清明节');
      expect(result3.isValid).toBe(true);
      expect(result3.error).toBeUndefined();
    });

    it('should reject non-string inputs', () => {
      const result = Validator.validateFestivalName(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('节日名称必须是字符串类型');
    });

    it('should reject empty strings', () => {
      const result = Validator.validateFestivalName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('节日名称不能为空');
    });

    it('should reject unsupported festival names', () => {
      const result = Validator.validateFestivalName('未知节日');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('不支持的节日名称');
    });
  });

  describe('validateSolarTermName', () => {
    it('should validate correct solar term names', () => {
      const result1 = Validator.validateSolarTermName('立春');
      expect(result1.isValid).toBe(true);
      expect(result1.error).toBeUndefined();

      const result2 = Validator.validateSolarTermName('雨水');
      expect(result2.isValid).toBe(true);
      expect(result2.error).toBeUndefined();

      const result3 = Validator.validateSolarTermName('冬至');
      expect(result3.isValid).toBe(true);
      expect(result3.error).toBeUndefined();
    });

    it('should reject non-string inputs', () => {
      const result = Validator.validateSolarTermName(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('节气名称必须是字符串类型');
    });

    it('should reject empty strings', () => {
      const result = Validator.validateSolarTermName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('节气名称不能为空');
    });

    it('should reject unsupported solar term names', () => {
      const result = Validator.validateSolarTermName('未知节气');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('不支持的节气名称');
    });
  });
});
