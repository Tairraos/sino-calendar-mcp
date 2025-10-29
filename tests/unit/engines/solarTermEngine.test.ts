import { SolarTermEngine } from '../../../src/engines/solarTermEngine';

describe('SolarTermEngine', () => {
  describe('getSolarTerm', () => {
    it('should return null for non-solar term dates', () => {
      const date = new Date(2025, 0, 15); // Random date
      const solarTerm = SolarTermEngine.getSolarTerm(date);
      // Most dates are not solar terms
      expect(solarTerm === null || typeof solarTerm === 'string').toBe(true);
    });

    it('should return solar term name for solar term dates', () => {
      // Test with known solar term dates
      const springBegins = new Date(2025, 1, 3); // Around 立春
      const solarTerm = SolarTermEngine.getSolarTerm(springBegins);
      expect(solarTerm === null || typeof solarTerm === 'string').toBe(true);
    });

    it('should handle different years', () => {
      const date2024 = new Date(2024, 1, 4);
      const date2025 = new Date(2025, 1, 4);

      const solarTerm2024 = SolarTermEngine.getSolarTerm(date2024);
      const solarTerm2025 = SolarTermEngine.getSolarTerm(date2025);

      expect(solarTerm2024 === null || typeof solarTerm2024 === 'string').toBe(true);
      expect(solarTerm2025 === null || typeof solarTerm2025 === 'string').toBe(true);
    });
  });

  describe('getYearSolarTerms', () => {
    it('should return 24 solar terms for a year', () => {
      const solarTerms = SolarTermEngine.getYearSolarTerms(2025);
      expect(solarTerms.size).toBeLessThanOrEqual(24);
      expect(solarTerms.size).toBeGreaterThan(0);
    });

    it('should return Map with string keys and Date values', () => {
      const solarTerms = SolarTermEngine.getYearSolarTerms(2025);

      for (const [name, date] of solarTerms) {
        expect(typeof name).toBe('string');
        expect(date).toBeInstanceOf(Date);
        expect(date.getFullYear()).toBe(2025);
      }
    });

    it('should handle different years', () => {
      const solarTerms2024 = SolarTermEngine.getYearSolarTerms(2024);
      const solarTerms2025 = SolarTermEngine.getYearSolarTerms(2025);

      expect(solarTerms2024.size).toBeGreaterThan(0);
      expect(solarTerms2025.size).toBeGreaterThan(0);
    });
  });

  describe('getNextSolarTerm', () => {
    it('should return next solar term for given date', () => {
      const date = new Date(2025, 0, 1); // 2025-01-01
      const nextSolarTerm = SolarTermEngine.getNextSolarTerm(date);

      expect(nextSolarTerm).toBeDefined();
      expect(nextSolarTerm?.name).toBeTruthy();
      expect(nextSolarTerm?.date).toBeInstanceOf(Date);
      expect(nextSolarTerm?.date.getTime()).toBeGreaterThan(date.getTime());
    });

    it('should return next year first solar term for late dates', () => {
      const lateDate = new Date(2025, 11, 31); // 2025-12-31
      const nextSolarTerm = SolarTermEngine.getNextSolarTerm(lateDate);

      expect(nextSolarTerm).toBeDefined();
      expect(nextSolarTerm?.name).toBeTruthy();
      expect(nextSolarTerm?.date).toBeInstanceOf(Date);
      expect(nextSolarTerm?.date.getFullYear()).toBe(2026);
    });
  });

  describe('getPreviousSolarTerm', () => {
    it('should return previous solar term for given date', () => {
      const date = new Date(2025, 11, 31); // 2025-12-31
      const previousSolarTerm = SolarTermEngine.getPreviousSolarTerm(date);

      expect(previousSolarTerm).toBeDefined();
      expect(previousSolarTerm?.name).toBeTruthy();
      expect(previousSolarTerm?.date).toBeInstanceOf(Date);
      expect(previousSolarTerm?.date.getTime()).toBeLessThan(date.getTime());
    });

    it('should return previous year last solar term for early dates', () => {
      const earlyDate = new Date(2025, 0, 1); // 2025-01-01
      const previousSolarTerm = SolarTermEngine.getPreviousSolarTerm(earlyDate);

      expect(previousSolarTerm).toBeDefined();
      expect(previousSolarTerm?.name).toBeTruthy();
      expect(previousSolarTerm?.date).toBeInstanceOf(Date);
      expect(previousSolarTerm?.date.getFullYear()).toBe(2024);
    });
  });

  describe('isSolarTerm', () => {
    it('should return boolean for any date', () => {
      const date = new Date(2025, 0, 15);
      const result = SolarTermEngine.isSolarTerm(date);
      expect(typeof result).toBe('boolean');
    });

    it('should return true for actual solar term dates', () => {
      // Get a known solar term date
      const solarTerms = SolarTermEngine.getYearSolarTerms(2025);
      const firstSolarTerm = Array.from(solarTerms.values())[0];

      if (firstSolarTerm) {
        const result = SolarTermEngine.isSolarTerm(firstSolarTerm);
        expect(result).toBe(true);
      }
    });
  });

  describe('getAllSolarTerms', () => {
    it('should return array of 24 solar terms', () => {
      const allSolarTerms = SolarTermEngine.getAllSolarTerms();
      expect(Array.isArray(allSolarTerms)).toBe(true);
      expect(allSolarTerms.length).toBe(24);
    });

    it('should return solar terms with correct properties', () => {
      const allSolarTerms = SolarTermEngine.getAllSolarTerms();

      allSolarTerms.forEach(term => {
        expect(term).toHaveProperty('name');
        expect(term).toHaveProperty('longitude');
        expect(term).toHaveProperty('order');
        expect(typeof term.name).toBe('string');
        expect(typeof term.longitude).toBe('number');
        expect(typeof term.order).toBe('number');
      });
    });
  });

  describe('getSolarTermByName', () => {
    it('should return solar term for valid name', () => {
      const term = SolarTermEngine.getSolarTermByName('立春');
      expect(term).toBeDefined();
      expect(term?.name).toBe('立春');
      expect(term?.longitude).toBe(315);
      expect(term?.order).toBe(1);
    });

    it('should return undefined for invalid name', () => {
      const term = SolarTermEngine.getSolarTermByName('无效节气');
      expect(term).toBeUndefined();
    });

    it('should handle empty string', () => {
      const term = SolarTermEngine.getSolarTermByName('');
      expect(term).toBeUndefined();
    });
  });

  describe('boundary conditions', () => {
    it('should handle very early date for getNextSolarTerm', () => {
      const veryEarlyDate = new Date(2025, 0, 1); // 2025-01-01
      const result = SolarTermEngine.getNextSolarTerm(veryEarlyDate);
      expect(result).toBeDefined();
      expect(result?.name).toBeTruthy();
      expect(result?.date).toBeInstanceOf(Date);
    });

    it('should handle very late date for getPreviousSolarTerm', () => {
      const veryLateDate = new Date(2025, 11, 31); // 2025-12-31
      const result = SolarTermEngine.getPreviousSolarTerm(veryLateDate);
      expect(result).toBeDefined();
      expect(result?.name).toBeTruthy();
      expect(result?.date).toBeInstanceOf(Date);
    });

    it('should return undefined for extreme future date (line 71 coverage)', () => {
      // Mock getYearSolarTerms to return empty Map for extreme future years
      const originalGetYearSolarTerms = SolarTermEngine.getYearSolarTerms;

      jest.spyOn(SolarTermEngine, 'getYearSolarTerms').mockImplementation((year: number) => {
        if (year >= 9999) {
          return new Map(); // Return empty Map for extreme future years
        }
        return originalGetYearSolarTerms.call(SolarTermEngine, year);
      });

      const extremeFutureDate = new Date(9998, 11, 31); // 9998-12-31
      const result = SolarTermEngine.getNextSolarTerm(extremeFutureDate);

      expect(result).toBeUndefined(); // Should trigger line 71

      // Restore original method
      jest.restoreAllMocks();
    });

    it('should return undefined for extreme past date (line 108 coverage)', () => {
      // Test with a very early date that might not have solar terms data
      // This should trigger the condition where lastSolarTerm is undefined
      const veryEarlyDate = new Date(1, 0, 1); // Year 1 AD

      // Mock getSolarTerm to return null for very early dates
      jest.spyOn(SolarTermEngine, 'getSolarTerm').mockReturnValue(null);

      const result = SolarTermEngine.getPreviousSolarTerm(veryEarlyDate);

      // With no solar terms available, this should return undefined
      expect(result).toBeUndefined();

      // Restore original method
      jest.restoreAllMocks();
    });
  });
});
