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
        endDate: '2025-01-31' 
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
  });
});