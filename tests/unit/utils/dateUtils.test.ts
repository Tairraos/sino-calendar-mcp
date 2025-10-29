import { DateUtils } from '../../../src/utils/dateUtils';

describe('DateUtils', () => {
  describe('formatChineseDate', () => {
    it('should format date correctly in Chinese', () => {
      const date = new Date(2025, 0, 1); // 2025-01-01
      const formatted = DateUtils.formatChineseDate(date);
      expect(formatted).toBe('2025年1月1日');
    });

    it('should handle different months and days', () => {
      const date = new Date(2025, 11, 25); // 2025-12-25
      const formatted = DateUtils.formatChineseDate(date);
      expect(formatted).toBe('2025年12月25日');
    });
  });

  describe('formatChineseWeek', () => {
    it('should return correct weekday for known dates', () => {
      const date = new Date(2025, 0, 1); // 2025-01-01 is Wednesday
      const weekday = DateUtils.formatChineseWeek(date);
      expect(weekday).toBe('星期三');
    });

    it('should return correct weekday for different days', () => {
      const sunday = new Date(2025, 0, 5); // 2025-01-05 is Sunday
      expect(DateUtils.formatChineseWeek(sunday)).toBe('星期日');

      const monday = new Date(2025, 0, 6); // 2025-01-06 is Monday
      expect(DateUtils.formatChineseWeek(monday)).toBe('星期一');
    });
  });

  describe('parseDate', () => {
    it('should parse valid date string', () => {
      const dateStr = '2025-01-01';
      const parsed = DateUtils.parseDate(dateStr);
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2025);
      expect(parsed.getMonth()).toBe(0);
      expect(parsed.getDate()).toBe(1);
    });

    it('should throw error for invalid date string', () => {
      expect(() => DateUtils.parseDate('invalid-date')).toThrow();
    });

    it('should throw error for empty string', () => {
      expect(() => DateUtils.parseDate('')).toThrow();
    });
  });

  describe('isValidDateString', () => {
    it('should return true for valid date strings', () => {
      expect(DateUtils.isValidDateString('2025-01-01')).toBe(true);
      expect(DateUtils.isValidDateString('2025-12-31')).toBe(true);
    });

    it('should return false for invalid date strings', () => {
      expect(DateUtils.isValidDateString('invalid-date')).toBe(false);
      expect(DateUtils.isValidDateString('')).toBe(false);
    });
  });

  describe('formatDateString', () => {
    it('should format date as ISO string', () => {
      const date = new Date(2025, 0, 1);
      const formatted = DateUtils.formatDateString(date);
      expect(formatted).toBe('2025-01-01');
    });
  });

  describe('generateDateRange', () => {
    it('should generate correct date range', () => {
      const startDate = new Date(2025, 0, 1);
      const endDate = new Date(2025, 0, 3);
      const dates = DateUtils.generateDateRange(startDate, endDate);

      expect(dates).toHaveLength(3);
      expect(dates[0].getDate()).toBe(1);
      expect(dates[1].getDate()).toBe(2);
      expect(dates[2].getDate()).toBe(3);
    });
  });

  describe('isWeekend', () => {
    it('should return true for weekend days', () => {
      const saturday = new Date(2025, 0, 4); // 2025-01-04 is Saturday
      const sunday = new Date(2025, 0, 5); // 2025-01-05 is Sunday

      expect(DateUtils.isWeekend(saturday)).toBe(true);
      expect(DateUtils.isWeekend(sunday)).toBe(true);
    });

    it('should return false for weekdays', () => {
      const monday = new Date(2025, 0, 6); // 2025-01-06 is Monday
      expect(DateUtils.isWeekend(monday)).toBe(false);
    });
  });

  describe('isWeekday', () => {
    it('should return true for weekdays', () => {
      const monday = new Date(2025, 0, 6); // 2025-01-06 is Monday
      expect(DateUtils.isWeekday(monday)).toBe(true);
    });

    it('should return false for weekend days', () => {
      const saturday = new Date(2025, 0, 4); // 2025-01-04 is Saturday
      expect(DateUtils.isWeekday(saturday)).toBe(false);
    });
  });
});
