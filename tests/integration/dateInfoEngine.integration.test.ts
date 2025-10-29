import { DateInfoEngine } from '../../src/engines/dateInfoEngine';

describe('DateInfoEngine Integration Tests', () => {
  describe('getDateInfo', () => {
    it('should return complete date information for New Year', () => {
      const date = new Date(2025, 0, 1); // 2025-01-01
      const dateInfo = DateInfoEngine.getDateInfo(date);

      expect(dateInfo).toHaveProperty('date');
      expect(dateInfo).toHaveProperty('week');
      expect(dateInfo).toHaveProperty('lunarDate');
      expect(dateInfo).toHaveProperty('festival', '元旦');
      expect(dateInfo).toHaveProperty('dayType');
      expect(typeof dateInfo.lunarDate).toBe('string');
      expect(dateInfo.lunarDate.length).toBeGreaterThan(0);
    });

    it('should return complete date information for Spring Festival', () => {
      const date = new Date(2025, 0, 29); // 2025-01-29 (Spring Festival 2025)
      const dateInfo = DateInfoEngine.getDateInfo(date);

      expect(dateInfo).toHaveProperty('date');
      expect(dateInfo).toHaveProperty('festival', '春节');
      expect(typeof dateInfo.lunarDate).toBe('string');
      expect(dateInfo.lunarDate).toContain('正月初一');
    });

    it('should return complete date information for Christmas', () => {
      const date = new Date(2025, 11, 25); // 2025-12-25
      const dateInfo = DateInfoEngine.getDateInfo(date);

      expect(dateInfo).toHaveProperty('date');
      expect(dateInfo).toHaveProperty('festival', '圣诞节');
      expect(dateInfo).toHaveProperty('week');
      expect(dateInfo).toHaveProperty('lunarDate');
    });

    it('should handle dates with solar terms', () => {
      const date = new Date(2025, 2, 20); // Around Spring Equinox
      const dateInfo = DateInfoEngine.getDateInfo(date);

      expect(dateInfo).toHaveProperty('date');
      expect(dateInfo).toHaveProperty('solarTerm');
      // Solar term might be null if not exactly on the date
      expect(typeof dateInfo.solarTerm === 'string' || dateInfo.solarTerm === null).toBe(true);
    });

    it('should handle workday information correctly', () => {
      const workday = new Date(2025, 0, 2); // 2025-01-02 (Thursday)
      const weekend = new Date(2025, 0, 4); // 2025-01-04 (Saturday)

      const workdayInfo = DateInfoEngine.getDateInfo(workday);
      const weekendInfo = DateInfoEngine.getDateInfo(weekend);

      expect(workdayInfo.dayType).toBe('工作日');
      expect(weekendInfo.dayType).toBe('休息日');
    });
  });

  describe('getDateRangeInfo', () => {
    it('should return information for a date range', () => {
      const startDate = new Date(2025, 0, 1);
      const endDate = new Date(2025, 0, 7);
      const rangeInfo = DateInfoEngine.getDateRangeInfo(startDate, endDate);

      expect(rangeInfo).toHaveProperty('dates');
      expect(Array.isArray(rangeInfo.dates)).toBe(true);
      expect(rangeInfo.dates).toHaveLength(7);

      // Check first date is New Year
      expect(rangeInfo.dates[0].festival).toBe('元旦');
    });

    it('should handle Spring Festival holiday period', () => {
      const startDate = new Date(2025, 0, 28); // Before Spring Festival
      const endDate = new Date(2025, 1, 3);   // After Spring Festival
      const rangeInfo = DateInfoEngine.getDateRangeInfo(startDate, endDate);

      expect(rangeInfo.dates.length).toBeGreaterThan(5);
      
      // Should include Spring Festival
      const springFestivalDate = rangeInfo.dates.find(d => d.festival === '春节');
      expect(springFestivalDate).toBeDefined();
    });

    it('should handle single day range', () => {
      const date = new Date(2025, 0, 1);
      const rangeInfo = DateInfoEngine.getDateRangeInfo(date, date);

      expect(rangeInfo.dates.length).toBe(1);
      expect(rangeInfo.dates).toHaveLength(1);
      expect(rangeInfo.dates[0].festival).toBe('元旦');
    });
  });

  describe('Error handling', () => {
    it('should handle invalid date gracefully', () => {
      const invalidDate = new Date('invalid');
      expect(() => DateInfoEngine.getDateInfo(invalidDate)).toThrow();
    });

    it('should handle invalid date range gracefully', () => {
      const startDate = new Date(2025, 0, 10);
      const endDate = new Date(2025, 0, 1); // End before start
      expect(() => DateInfoEngine.getDateRangeInfo(startDate, endDate)).toThrow();
    });
  });

  describe('Performance tests', () => {
    it('should handle large date ranges efficiently', () => {
      const startDate = new Date(2025, 0, 1);
      const endDate = new Date(2025, 11, 31); // Full year
      
      const startTime = Date.now();
      const rangeInfo = DateInfoEngine.getDateRangeInfo(startDate, endDate);
      const endTime = Date.now();

      expect(rangeInfo.dates.length).toBe(365); // 2025 is not a leap year
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
})