import {
  ErrorHandler,
  ValidationError,
  DateParseError,
  DateRangeError,
  ToolNotFoundError,
} from '../../../src/utils/errorHandler';

describe('ErrorHandler', () => {
  describe('Custom Error Classes', () => {
    it('should create ValidationError correctly', () => {
      const error = new ValidationError('Test validation error');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Test validation error');
    });

    it('should create DateParseError correctly', () => {
      const error = new DateParseError('Test date parse error');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DateParseError);
      expect(error.name).toBe('DateParseError');
      expect(error.message).toBe('Test date parse error');
    });

    it('should create DateRangeError correctly', () => {
      const error = new DateRangeError('Test date range error');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DateRangeError);
      expect(error.name).toBe('DateRangeError');
      expect(error.message).toBe('Test date range error');
    });

    it('should create ToolNotFoundError correctly', () => {
      const error = new ToolNotFoundError('test_tool');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ToolNotFoundError);
      expect(error.name).toBe('ToolNotFoundError');
      expect(error.message).toBe('未知的工具: test_tool');
    });
  });

  describe('handleError', () => {
    it('should handle ValidationError', () => {
      const error = new ValidationError('Invalid input');
      const result = ErrorHandler.handleError(error);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('isError', true);
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content).toHaveLength(1);

      const errorData = JSON.parse(result.content[0].text);
      expect(errorData.message).toContain('输入验证错误');
      expect(errorData.type).toBe('ValidationError');
    });

    it('should handle DateParseError', () => {
      const error = new DateParseError('Invalid date format');
      const result = ErrorHandler.handleError(error);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('isError', true);

      const errorData = JSON.parse(result.content[0].text);
      expect(errorData.message).toContain('日期解析错误');
      expect(errorData.type).toBe('DateParseError');
    });

    it('should handle DateRangeError', () => {
      const error = new DateRangeError('Invalid date range');
      const result = ErrorHandler.handleError(error);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('isError', true);

      const errorData = JSON.parse(result.content[0].text);
      expect(errorData.message).toContain('日期范围错误');
      expect(errorData.type).toBe('DateRangeError');
    });

    it('should handle ToolNotFoundError', () => {
      const error = new ToolNotFoundError('unknown_tool');
      const result = ErrorHandler.handleError(error);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('isError', true);

      const errorData = JSON.parse(result.content[0].text);
      expect(errorData.type).toBe('ToolNotFoundError');
    });

    it('should handle generic Error', () => {
      const error = new Error('Generic error');
      const result = ErrorHandler.handleError(error);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('isError', true);

      const errorData = JSON.parse(result.content[0].text);
      expect(errorData.message).toContain('系统错误');
      expect(errorData.type).toBe('SystemError');
    });

    it('should handle non-Error objects', () => {
      const error = 'String error';
      const result = ErrorHandler.handleError(error);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('isError', true);

      const errorData = JSON.parse(result.content[0].text);
      expect(errorData.message).toContain('未知错误');
      expect(errorData.type).toBe('UnknownError');
    });
  });

  describe('safeExecute', () => {
    it('should execute function successfully', async () => {
      const fn = () => 'success';
      const result = await ErrorHandler.safeExecute(fn);

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('data');
      expect(result.data).toBe('success');
    });

    it('should handle function that throws error', async () => {
      const fn = () => {
        throw new ValidationError('Test error');
      };
      const result = await ErrorHandler.safeExecute(fn);

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });

    it('should handle async function successfully', async () => {
      const fn = async () => 'async success';
      const result = await ErrorHandler.safeExecute(fn);

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('data');
      expect(result.data).toBe('async success');
    });

    it('should handle async function that throws error', async () => {
      const fn = async () => {
        throw new DateParseError('Async error');
      };
      const result = await ErrorHandler.safeExecute(fn);

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });
  });

  describe('validateAndThrow', () => {
    it('should not throw for valid validation', () => {
      const validation = { isValid: true };
      expect(() => ErrorHandler.validateAndThrow(validation)).not.toThrow();
    });

    it('should throw ValidationError for invalid validation', () => {
      const validation = { isValid: false, error: 'Test error' };
      expect(() => ErrorHandler.validateAndThrow(validation)).toThrow(ValidationError);
      expect(() => ErrorHandler.validateAndThrow(validation)).toThrow('Test error');
    });

    it('should throw with default message if no error provided', () => {
      const validation = { isValid: false };
      expect(() => ErrorHandler.validateAndThrow(validation)).toThrow(ValidationError);
    });
  });

  describe('createSuccessResponse', () => {
    it('should create MCP format response with data', () => {
      const data = { test: 'data' };
      const response = ErrorHandler.createSuccessResponse(data);

      expect(response).toHaveProperty('content');
      expect(Array.isArray(response.content)).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]).toHaveProperty('type', 'text');
      expect(response.content[0]).toHaveProperty('text');

      const parsedText = JSON.parse(response.content[0].text);
      expect(parsedText).toEqual(data);
    });

    it('should handle null data', () => {
      const response = ErrorHandler.createSuccessResponse(null);

      expect(response).toHaveProperty('content');
      expect(Array.isArray(response.content)).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]).toHaveProperty('type', 'text');
      expect(response.content[0]).toHaveProperty('text');

      const parsedText = JSON.parse(response.content[0].text);
      expect(parsedText).toBeNull();
    });

    it('should handle undefined data', () => {
      const response = ErrorHandler.createSuccessResponse(undefined);

      expect(response).toHaveProperty('content');
      expect(Array.isArray(response.content)).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]).toHaveProperty('type', 'text');
    });
  });

  describe('logOperation', () => {
    it('should log operation without throwing', () => {
      expect(() => {
        ErrorHandler.logOperation('test_operation', { param: 'value' });
      }).not.toThrow();
    });

    it('should log operation with result', () => {
      expect(() => {
        ErrorHandler.logOperation('test_operation', { param: 'value' }, { result: 'success' });
      }).not.toThrow();
    });

    it('should handle null parameters', () => {
      expect(() => {
        ErrorHandler.logOperation('test_operation', null);
      }).not.toThrow();
    });
  });

  describe('checkSystemLimits', () => {
    it('should not throw for normal operations', () => {
      expect(() => {
        ErrorHandler.checkSystemLimits('get_date_info', { date: '2025-01-01' });
      }).not.toThrow();
    });

    it('should handle date range operations', () => {
      expect(() => {
        ErrorHandler.checkSystemLimits('get_date_range_info', {
          startDate: '2025-01-01',
          endDate: '2025-01-31',
        });
      }).not.toThrow();
    });

    it('should throw for very large date ranges', () => {
      expect(() => {
        ErrorHandler.checkSystemLimits('get_date_range_info', {
          startDate: '2020-01-01',
          endDate: '2030-12-31',
        });
      }).toThrow();
    });

    it('should handle unknown operations', () => {
      expect(() => {
        ErrorHandler.checkSystemLimits('unknown_operation', {});
      }).not.toThrow();
    });
  });

  describe('formatUserFriendlyError', () => {
    it('should format ValidationError', () => {
      const error = new ValidationError('Invalid input');
      const formatted = ErrorHandler.formatUserFriendlyError(error);

      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('Invalid input');
    });

    it('should format DateParseError', () => {
      const error = new DateParseError('Invalid date');
      const formatted = ErrorHandler.formatUserFriendlyError(error);

      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('Invalid date');
    });

    it('should format generic Error', () => {
      const error = new Error('Generic error');
      const formatted = ErrorHandler.formatUserFriendlyError(error);

      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });

    it('should handle non-Error objects', () => {
      const error = 'String error';
      const formatted = ErrorHandler.formatUserFriendlyError(error);

      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });
  });
});
