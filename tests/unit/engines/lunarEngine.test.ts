import { LunarEngine } from '../../../src/engines/lunarEngine';

describe('LunarEngine', () => {
  describe('convertToLunar', () => {
    it('should convert Gregorian date to lunar format', () => {
      const date = new Date(2025, 0, 1); // 2025-01-01
      const lunar = LunarEngine.convertToLunar(date);
      expect(lunar).toContain('年');
      expect(lunar).toContain('月');
      expect(typeof lunar).toBe('string');
    });

    it('should handle different dates correctly', () => {
      const springFestival = new Date(2025, 0, 29); // 2025-01-29 (Spring Festival)
      const lunar = LunarEngine.convertToLunar(springFestival);
      expect(lunar).toContain('正月初一');
    });

    it('should handle leap months', () => {
      // 2023年有闰二月，测试闰二月的日期
      const date = new Date(2023, 2, 22); // 2023-03-22 (闰二月初一)
      const lunar = LunarEngine.convertToLunar(date);
      expect(typeof lunar).toBe('string');
      expect(lunar).toContain('年');
      expect(lunar).toContain('闰');
    });

    it('should handle actual leap month dates', () => {
      // 2020年有闰四月，测试闰四月的日期
      const date = new Date(2020, 4, 23); // 2020-05-23 (闰四月初一)
      const lunar = LunarEngine.convertToLunar(date);
      expect(typeof lunar).toBe('string');
      expect(lunar).toContain('闰');
    });
  });

  describe('getYearInGanZhi', () => {
    it('should return year in GanZhi format', () => {
      const date = new Date(2025, 0, 1);
      const ganZhi = LunarEngine.getYearInGanZhi(date);
      expect(typeof ganZhi).toBe('string');
      expect(ganZhi).toHaveLength(2); // GanZhi should be 2 characters
    });

    it('should return different GanZhi for different years', () => {
      const date2024 = new Date(2024, 0, 1);
      const date2025 = new Date(2025, 0, 1);
      const ganZhi2024 = LunarEngine.getYearInGanZhi(date2024);
      const ganZhi2025 = LunarEngine.getYearInGanZhi(date2025);
      expect(ganZhi2024).not.toBe(ganZhi2025);
    });
  });

  describe('getMonthInChinese', () => {
    it('should return month in Chinese format', () => {
      const date = new Date(2025, 0, 29); // Spring Festival
      const month = LunarEngine.getMonthInChinese(date);
      expect(month).toBe('正');
    });

    it('should handle different months', () => {
      const date = new Date(2025, 5, 15); // Mid-year date
      const month = LunarEngine.getMonthInChinese(date);
      expect(typeof month).toBe('string');
      expect(month.length).toBeGreaterThan(0);
    });

    it('should handle leap months correctly', () => {
      // 测试闰月情况
      const date = new Date(2020, 4, 23); // 2020-05-23 (闰四月初一)
      const month = LunarEngine.getMonthInChinese(date);
      expect(typeof month).toBe('string');
      expect(month).toContain('闰');
    });

    it('should handle non-leap months correctly', () => {
      const date = new Date(2025, 0, 29); // 非闰月 (正月)
      const month = LunarEngine.getMonthInChinese(date);
      expect(typeof month).toBe('string');
      expect(month).not.toContain('闰');
    });
  });

  describe('getDayInChinese', () => {
    it('should return day in Chinese format', () => {
      const date = new Date(2025, 0, 29); // Spring Festival
      const day = LunarEngine.getDayInChinese(date);
      expect(day).toBe('初一');
    });

    it('should handle different days of month', () => {
      const date = new Date(2025, 1, 12); // Mid-month date
      const day = LunarEngine.getDayInChinese(date);
      expect(typeof day).toBe('string');
      expect(day.length).toBeGreaterThan(0);
    });

    it('should handle end of month dates', () => {
      const date = new Date(2025, 2, 28); // End of month
      const day = LunarEngine.getDayInChinese(date);
      expect(typeof day).toBe('string');
    });
  });

  describe('isLeapMonth', () => {
    it('should return boolean for leap month check', () => {
      const date = new Date(2025, 0, 1);
      const isLeap = LunarEngine.isLeapMonth(date);
      expect(typeof isLeap).toBe('boolean');
    });

    it('should correctly identify non-leap months', () => {
      const date = new Date(2025, 0, 29); // Spring Festival (正月)
      const isLeap = LunarEngine.isLeapMonth(date);
      expect(isLeap).toBe(false);
    });

    it('should correctly identify leap months', () => {
      // 2020年有闰四月，测试闰四月的日期
      const date = new Date(2020, 4, 23); // 2020-05-23 (闰四月初一)
      const isLeap = LunarEngine.isLeapMonth(date);
      expect(isLeap).toBe(true);
    });

    it('should correctly identify regular months in leap years', () => {
      // 2020年有闰四月，但测试正常的五月
      const date = new Date(2020, 5, 21); // 2020-06-21 (五月初一)
      const isLeap = LunarEngine.isLeapMonth(date);
      expect(isLeap).toBe(false);
    });
  });

  describe('getLeapMonth', () => {
    it('should return leap month number or 0', () => {
      const date = new Date(2025, 0, 1);
      const leapMonth = LunarEngine.getLeapMonth(date);
      expect(typeof leapMonth).toBe('number');
      expect(leapMonth).toBeGreaterThanOrEqual(0);
      expect(leapMonth).toBeLessThanOrEqual(12);
    });

    it('should handle different years', () => {
      const date2024 = new Date(2024, 0, 1);
      const date2025 = new Date(2025, 0, 1);

      const leapMonth2024 = LunarEngine.getLeapMonth(date2024);
      const leapMonth2025 = LunarEngine.getLeapMonth(date2025);

      expect(typeof leapMonth2024).toBe('number');
      expect(typeof leapMonth2025).toBe('number');
      expect(leapMonth2024).toBeGreaterThanOrEqual(0);
      expect(leapMonth2025).toBeGreaterThanOrEqual(0);
    });

    it('should return correct leap month for leap years', () => {
      // 2020年有闰四月，使用2020年中期的日期
      const date2020 = new Date(2020, 5, 1); // 2020-06-01
      const leapMonth2020 = LunarEngine.getLeapMonth(date2020);
      expect(leapMonth2020).toBe(4); // 闰四月
    });

    it('should return 0 for non-leap years', () => {
      // 2025年没有闰月
      const date2025 = new Date(2025, 0, 1);
      const leapMonth2025 = LunarEngine.getLeapMonth(date2025);
      expect(leapMonth2025).toBe(0); // 无闰月
    });
  });
});
