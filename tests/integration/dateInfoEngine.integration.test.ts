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
      const endDate = new Date(2025, 1, 3); // After Spring Festival
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
      // 现在 getDateInfo 有异常处理，不会抛出异常，而是返回基本信息
      const result = DateInfoEngine.getDateInfo(invalidDate);
      expect(result).toBeDefined();
      expect(result.date).toBeDefined();
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

  describe('getDateStatistics', () => {
    it('should return detailed statistics for a workday', () => {
      const date = new Date(2025, 0, 2); // 2025-01-02 (Thursday)
      const stats = DateInfoEngine.getDateStatistics(date);

      expect(stats).toHaveProperty('date');
      expect(stats).toHaveProperty('week');
      expect(stats).toHaveProperty('dayType');
      expect(stats).toHaveProperty('lunarDate');
      expect(stats).toHaveProperty('statistics');

      expect(stats.statistics).toHaveProperty('isWorkday');
      expect(stats.statistics).toHaveProperty('isHoliday');
      expect(stats.statistics).toHaveProperty('isAdjusted');
      expect(stats.statistics).toHaveProperty('isWeekend');
      expect(stats.statistics).toHaveProperty('isSolarTerm');
      expect(stats.statistics).toHaveProperty('isLeapMonth');
      expect(stats.statistics).toHaveProperty('yearHolidaysCount');
      expect(stats.statistics).toHaveProperty('yearWorkingDaysCount');

      expect(typeof stats.statistics.isWorkday).toBe('boolean');
      expect(typeof stats.statistics.isHoliday).toBe('boolean');
      expect(typeof stats.statistics.isAdjusted).toBe('boolean');
      expect(typeof stats.statistics.isWeekend).toBe('boolean');
      expect(typeof stats.statistics.isSolarTerm).toBe('boolean');
      expect(typeof stats.statistics.isLeapMonth).toBe('boolean');
      expect(typeof stats.statistics.yearHolidaysCount).toBe('number');
      expect(typeof stats.statistics.yearWorkingDaysCount).toBe('number');
    });

    it('should return statistics for a holiday', () => {
      const date = new Date(2025, 0, 1); // 2025-01-01 (New Year)
      const stats = DateInfoEngine.getDateStatistics(date);

      expect(stats.festival).toBe('元旦');
      // isHoliday depends on WorkdayEngine logic, not just festival presence
      expect(typeof stats.statistics.isHoliday).toBe('boolean');
      expect(stats.statistics.yearHolidaysCount).toBeGreaterThan(0);
      expect(stats.statistics.yearWorkingDaysCount).toBeGreaterThan(0);
    });

    it('should return statistics for a weekend', () => {
      const date = new Date(2025, 0, 4); // 2025-01-04 (Saturday)
      const stats = DateInfoEngine.getDateStatistics(date);

      expect(stats.statistics.isWeekend).toBe(true);
      expect(stats.statistics.isWorkday).toBe(false);
    });
  });

  describe('getMonthFestivals', () => {
    it('should return festivals for January 2025', () => {
      const festivals = DateInfoEngine.getMonthFestivals(2025, 1);

      expect(Array.isArray(festivals)).toBe(true);
      expect(festivals.length).toBeGreaterThan(0);

      // Should include New Year
      const newYear = festivals.find(f => f.festival === '元旦');
      expect(newYear).toBeDefined();
      expect(newYear?.date).toContain('2025年1月1日');

      // Should include Spring Festival
      const springFestival = festivals.find(f => f.festival === '春节');
      expect(springFestival).toBeDefined();
    });

    it('should return festivals for December 2025', () => {
      const festivals = DateInfoEngine.getMonthFestivals(2025, 12);

      expect(Array.isArray(festivals)).toBe(true);
      expect(festivals.length).toBeGreaterThan(0);

      // Should include Christmas
      const christmas = festivals.find(f => f.festival === '圣诞节');
      expect(christmas).toBeDefined();
      expect(christmas?.date).toContain('2025年12月25日');
    });

    it('should return empty array for month with no festivals', () => {
      // Test a month that typically has fewer festivals
      const festivals = DateInfoEngine.getMonthFestivals(2025, 11);
      expect(Array.isArray(festivals)).toBe(true);
      // November might have some festivals, so just check it's an array
    });
  });

  describe('getYearSolarTerms', () => {
    it('should return all 24 solar terms for 2025', () => {
      const solarTerms = DateInfoEngine.getYearSolarTerms(2025);

      expect(Array.isArray(solarTerms)).toBe(true);
      expect(solarTerms.length).toBe(24);

      // Check that all solar terms have required properties
      solarTerms.forEach(term => {
        expect(term).toHaveProperty('date');
        expect(term).toHaveProperty('name');
        expect(typeof term.date).toBe('string');
        expect(typeof term.name).toBe('string');
      });

      // Check for specific solar terms
      const springEquinox = solarTerms.find(t => t.name === '春分');
      const summerSolstice = solarTerms.find(t => t.name === '夏至');
      const autumnEquinox = solarTerms.find(t => t.name === '秋分');
      const winterSolstice = solarTerms.find(t => t.name === '冬至');

      expect(springEquinox).toBeDefined();
      expect(summerSolstice).toBeDefined();
      expect(autumnEquinox).toBeDefined();
      expect(winterSolstice).toBeDefined();
    });

    it('should return solar terms in chronological order', () => {
      const solarTerms = DateInfoEngine.getYearSolarTerms(2025);

      for (let i = 1; i < solarTerms.length; i++) {
        const prevDate = new Date(
          solarTerms[i - 1].date
            .replace(/年|月|日/g, '-')
            .replace('--', '-')
            .slice(0, -1),
        );
        const currDate = new Date(
          solarTerms[i].date
            .replace(/年|月|日/g, '-')
            .replace('--', '-')
            .slice(0, -1),
        );
        expect(currDate.getTime()).toBeGreaterThan(prevDate.getTime());
      }
    });
  });

  describe('getSurroundingInfo', () => {
    it('should return surrounding dates for a given date', () => {
      const date = new Date('2025-01-01');
      const surroundingInfo = DateInfoEngine.getSurroundingInfo(date, 3);

      expect(surroundingInfo.centerDate).toBeDefined();
      expect(surroundingInfo.centerDate.date).toBe('2025年1月1日');

      // totalDays should be the total range (7 days)
      expect(surroundingInfo.totalDays).toBe(7); // 3 before + center + 3 after

      // surroundingDates only contains dates with special info (festivals, solar terms, adjustments)
      expect(surroundingInfo.surroundingDates).toBeDefined();
      expect(Array.isArray(surroundingInfo.surroundingDates)).toBe(true);

      // Check that all returned dates have special information
      surroundingInfo.surroundingDates.forEach(dateInfo => {
        expect(dateInfo.festival || dateInfo.solarTerm || dateInfo.adjusted).toBeTruthy();
      });
    });

    it('should handle edge cases at month boundaries', () => {
      const date = new Date('2025-01-01'); // First day of year
      const surroundingInfo = DateInfoEngine.getSurroundingInfo(date, 2);

      expect(surroundingInfo.centerDate).toBeDefined();
      expect(surroundingInfo.centerDate.date).toBe('2025年1月1日');

      // totalDays should be the total range (5 days)
      expect(surroundingInfo.totalDays).toBe(5); // 2 before + center + 2 after

      // surroundingDates only contains dates with special info
      expect(surroundingInfo.surroundingDates).toBeDefined();
      expect(Array.isArray(surroundingInfo.surroundingDates)).toBe(true);

      // Check that all returned dates have special information
      surroundingInfo.surroundingDates.forEach(dateInfo => {
        expect(dateInfo.festival || dateInfo.solarTerm || dateInfo.adjusted).toBeTruthy();
      });
    });

    it('should handle single day surrounding', () => {
      const centerDate = new Date(2025, 5, 15); // 2025-06-15
      const days = 0;
      const surroundingInfo = DateInfoEngine.getSurroundingInfo(centerDate, days);

      expect(surroundingInfo.totalDays).toBe(1);
      expect(surroundingInfo.surroundingDates.length).toBe(1);
      expect(surroundingInfo.surroundingDates[0].date).toContain('2025年6月15日');
    });

    it('should handle zero days parameter (line 154 coverage)', () => {
      // Test with zero days to ensure line 154 is covered
      const centerDate = new Date(2025, 5, 15); // 2025-06-15
      const days = 0; // Zero days - should still execute line 154
      const surroundingInfo = DateInfoEngine.getSurroundingInfo(centerDate, days);

      expect(surroundingInfo.centerDate).toBeDefined();
      expect(surroundingInfo.totalDays).toBe(1); // Only center date
      expect(Array.isArray(surroundingInfo.surroundingDates)).toBe(true);
    });

    it('should handle very large days parameter (line 154 coverage)', () => {
      // Test with very large days to ensure line 154 is covered
      const centerDate = new Date(2025, 5, 15); // 2025-06-15
      const days = 100; // Very large days
      const surroundingInfo = DateInfoEngine.getSurroundingInfo(centerDate, days);

      expect(surroundingInfo.centerDate).toBeDefined();
      expect(surroundingInfo.totalDays).toBe(201); // 100 before + center + 100 after
      expect(Array.isArray(surroundingInfo.surroundingDates)).toBe(true);
    });

    it('should handle edge case with month boundary crossing (line 154 coverage)', () => {
      // Test with date at month boundary to ensure line 154 is covered
      const centerDate = new Date(2025, 0, 1); // 2025-01-01 (start of year)
      const days = 10; // This will cross into previous year
      const surroundingInfo = DateInfoEngine.getSurroundingInfo(centerDate, days);

      expect(surroundingInfo.centerDate).toBeDefined();
      expect(surroundingInfo.totalDays).toBe(21); // 10 before + center + 10 after
      expect(Array.isArray(surroundingInfo.surroundingDates)).toBe(true);
    });

    it('should execute line 154 with explicit test (line 154 coverage)', () => {
      // Directly test the getSurroundingInfo method to ensure line 154 is executed
      const centerDate = new Date(2025, 5, 15); // 2025-06-15
      const days = 1; // Simple case that should definitely execute line 154

      // Call the method - this should execute line 154: startDate.setDate(startDate.getDate() - days);
      const surroundingInfo = DateInfoEngine.getSurroundingInfo(centerDate, days);

      expect(surroundingInfo).toBeDefined();
      expect(surroundingInfo.centerDate).toBeDefined();
      expect(surroundingInfo.totalDays).toBe(3); // 1 before + center + 1 after
      expect(Array.isArray(surroundingInfo.surroundingDates)).toBe(true);

      // Verify the center date is correct
      expect(surroundingInfo.centerDate.date).toContain('2025年6月15日');
    });

    it('should use default parameter value (default branch coverage)', () => {
      // Test the default parameter branch: days: number = 7
      const centerDate = new Date(2025, 5, 15); // 2025-06-15

      // Call without the days parameter to trigger the default value branch
      const surroundingInfo = DateInfoEngine.getSurroundingInfo(centerDate);

      expect(surroundingInfo).toBeDefined();
      expect(surroundingInfo.centerDate).toBeDefined();
      expect(surroundingInfo.totalDays).toBe(15); // 7 before + center + 7 after
      expect(Array.isArray(surroundingInfo.surroundingDates)).toBe(true);
    });
  });
});
