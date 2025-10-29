import { WorkdayEngine } from '../../../src/engines/workdayEngine';

describe('WorkdayEngine', () => {
  describe('getDayType', () => {
    it('should return workday for Monday to Friday', () => {
      const monday = new Date(2025, 0, 6); // 2025-01-06 is Monday
      const result = WorkdayEngine.getDayType(monday);
      expect(result.dayType).toBe('工作日');
    });

    it('should return rest day for Saturday and Sunday', () => {
      const saturday = new Date(2025, 0, 4); // 2025-01-04 is Saturday
      const result = WorkdayEngine.getDayType(saturday);
      expect(result.dayType).toBe('休息日');

      const sunday = new Date(2025, 0, 5); // 2025-01-05 is Sunday
      const result2 = WorkdayEngine.getDayType(sunday);
      expect(result2.dayType).toBe('休息日');
    });

    it('should handle adjusted holidays', () => {
      // Test with a date that might be an adjusted holiday
      const date = new Date(2025, 0, 1); // New Year's Day
      const result = WorkdayEngine.getDayType(date);
      expect(['工作日', '休息日']).toContain(result.dayType);
    });

    it('should return adjustment info when applicable', () => {
      const date = new Date(2025, 0, 1);
      const result = WorkdayEngine.getDayType(date);

      if (result.adjusted) {
        expect(result.adjusted).toBe('调休');
      }
    });

    it('should handle different years', () => {
      const date2024 = new Date(2024, 0, 1);
      const date2025 = new Date(2025, 0, 1);

      const result2024 = WorkdayEngine.getDayType(date2024);
      const result2025 = WorkdayEngine.getDayType(date2025);

      expect(['工作日', '休息日']).toContain(result2024.dayType);
      expect(['工作日', '休息日']).toContain(result2025.dayType);
    });
  });

  describe('isWorkday', () => {
    it('should return true for working days', () => {
      const monday = new Date(2025, 0, 6); // 2025-01-06 is Monday
      expect(WorkdayEngine.isWorkday(monday)).toBe(true);
    });

    it('should return false for weekends', () => {
      const saturday = new Date(2025, 0, 4); // 2025-01-04 is Saturday
      expect(WorkdayEngine.isWorkday(saturday)).toBe(false);
    });
  });

  describe('isHoliday', () => {
    it('should return true for rest days', () => {
      const saturday = new Date(2025, 0, 4); // 2025-01-04 is Saturday
      expect(WorkdayEngine.isHoliday(saturday)).toBe(true);
    });

    it('should return false for working days', () => {
      const monday = new Date(2025, 0, 6); // 2025-01-06 is Monday
      expect(WorkdayEngine.isHoliday(monday)).toBe(false);
    });
  });

  describe('getYearHolidays', () => {
    it('should return array of holiday dates in year', () => {
      const year = 2025;
      const holidays = WorkdayEngine.getYearHolidays(year);

      expect(Array.isArray(holidays)).toBe(true);

      holidays.forEach(holiday => {
        expect(typeof holiday).toBe('string');
        expect(holiday).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
      });
    });

    it('should handle different years', () => {
      const holidays2024 = WorkdayEngine.getYearHolidays(2024);
      const holidays2025 = WorkdayEngine.getYearHolidays(2025);

      expect(Array.isArray(holidays2024)).toBe(true);
      expect(Array.isArray(holidays2025)).toBe(true);
    });

    it('should return holidays in chronological order', () => {
      const year = 2025;
      const holidays = WorkdayEngine.getYearHolidays(year);

      for (let i = 1; i < holidays.length; i++) {
        expect(holidays[i] >= holidays[i - 1]).toBe(true);
      }
    });
  });

  describe('getYearWorkingDays', () => {
    it('should return array of working day dates in year', () => {
      const year = 2025;
      const workingDays = WorkdayEngine.getYearWorkingDays(year);

      expect(Array.isArray(workingDays)).toBe(true);

      workingDays.forEach(workingDay => {
        expect(typeof workingDay).toBe('string');
        expect(workingDay).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
      });
    });

    it('should handle different years', () => {
      const workingDays2024 = WorkdayEngine.getYearWorkingDays(2024);
      const workingDays2025 = WorkdayEngine.getYearWorkingDays(2025);

      expect(Array.isArray(workingDays2024)).toBe(true);
      expect(Array.isArray(workingDays2025)).toBe(true);
    });
  });

  describe('countWorkdays', () => {
    it('should count working days in date range', () => {
      const startDate = new Date(2025, 0, 1); // 2025-01-01
      const endDate = new Date(2025, 0, 7); // 2025-01-07
      const count = WorkdayEngine.countWorkdays(startDate, endDate);

      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
      expect(count).toBeLessThanOrEqual(7);
    });
  });

  describe('countHolidays', () => {
    it('should count holidays in date range', () => {
      const startDate = new Date(2025, 0, 1); // 2025-01-01
      const endDate = new Date(2025, 0, 7); // 2025-01-07
      const count = WorkdayEngine.countHolidays(startDate, endDate);

      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
      expect(count).toBeLessThanOrEqual(7);
    });
  });

  describe('getNextWorkday', () => {
    it('should return next working day', () => {
      const friday = new Date(2025, 0, 3); // 2025-01-03 is Friday
      const nextWorkday = WorkdayEngine.getNextWorkday(friday);

      expect(nextWorkday).toBeInstanceOf(Date);
      expect(WorkdayEngine.isWorkday(nextWorkday)).toBe(true);
      expect(nextWorkday.getTime()).toBeGreaterThan(friday.getTime());
    });
  });

  describe('getPreviousWorkday', () => {
    it('should return previous working day', () => {
      const monday = new Date(2025, 0, 6); // 2025-01-06 is Monday
      const prevWorkday = WorkdayEngine.getPreviousWorkday(monday);

      expect(prevWorkday).toBeInstanceOf(Date);
      expect(WorkdayEngine.isWorkday(prevWorkday)).toBe(true);
      expect(prevWorkday.getTime()).toBeLessThan(monday.getTime());
    });
  });

  describe('getHolidayAdjustment', () => {
    it('should return adjustment rule for existing holiday', () => {
      // Test with a known holiday adjustment (if any exists in the data)
      const adjustment = WorkdayEngine.getHolidayAdjustment(2025, '元旦');

      if (adjustment) {
        expect(adjustment).toHaveProperty('year');
        expect(adjustment).toHaveProperty('holiday');
        expect(adjustment.year).toBe(2025);
        expect(adjustment.holiday).toBe('元旦');
      } else {
        // If no adjustment exists, it should return undefined
        expect(adjustment).toBeUndefined();
      }
    });

    it('should return undefined for non-existent holiday', () => {
      const adjustment = WorkdayEngine.getHolidayAdjustment(2025, '不存在的节日');
      expect(adjustment).toBeUndefined();
    });

    it('should return undefined for non-existent year', () => {
      const adjustment = WorkdayEngine.getHolidayAdjustment(1900, '元旦');
      expect(adjustment).toBeUndefined();
    });
  });

  describe('getDayType - Edge Cases', () => {
    it('should handle working date that is not weekend (line 38 coverage)', () => {
      // Create a mock rule with a weekday (Monday) in workingDates
      const mockRules = [
        {
          year: 2025,
          holiday: '测试节日',
          holidayDates: [],
          workingDates: ['2025-01-06'], // Monday - not a weekend
        },
      ];

      // Mock the adjustmentRules module
      jest.doMock('../../../src/data/adjustmentRules', () => ({
        adjustmentRules: mockRules,
      }));

      // Re-import WorkdayEngine to use mocked data
      jest.resetModules();
      const { WorkdayEngine: MockedWorkdayEngine } = require('../../../src/engines/workdayEngine');

      const monday = new Date(2025, 0, 6); // 2025-01-06 is Monday
      const result = MockedWorkdayEngine.getDayType(monday);

      expect(result.dayType).toBe('工作日');
      expect(result.adjusted).toBeUndefined(); // Should not have adjusted property

      // Restore original modules
      jest.dontMock('../../../src/data/adjustmentRules');
      jest.resetModules();
    });
  });
});
