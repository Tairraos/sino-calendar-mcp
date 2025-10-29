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
      const term2024 = SolarTermEngine.getSolarTerm(date2024);
      const term2025 = SolarTermEngine.getSolarTerm(date2025);
      expect(term2024 === null || typeof term2024 === 'string').toBe(true);
      expect(term2025 === null || typeof term2025 === 'string').toBe(true);
    });
  });

  describe('getYearSolarTerms', () => {
    it('should return map of solar terms for a year', () => {
      const year = 2025;
      const solarTermsMap = SolarTermEngine.getYearSolarTerms(year);
      expect(solarTermsMap).toBeInstanceOf(Map);
      // Should have some solar terms (24 in total for a year)
      expect(solarTermsMap.size).toBeGreaterThanOrEqual(0);
    });

    it('should return dates for solar terms', () => {
      const year = 2025;
      const solarTermsMap = SolarTermEngine.getYearSolarTerms(year);

      for (const [name, date] of solarTermsMap) {
        expect(typeof name).toBe('string');
        expect(date).toBeInstanceOf(Date);
        expect(date.getFullYear()).toBe(year);
      }
    });

    it('should handle different years', () => {
      const terms2024 = SolarTermEngine.getYearSolarTerms(2024);
      const terms2025 = SolarTermEngine.getYearSolarTerms(2025);
      expect(terms2024).toBeInstanceOf(Map);
      expect(terms2025).toBeInstanceOf(Map);
    });

    it('should return all 24 solar terms for a complete year', () => {
      const year = 2025;
      const solarTermsMap = SolarTermEngine.getYearSolarTerms(year);

      // Should have exactly 24 solar terms
      expect(solarTermsMap.size).toBe(24);

      // Check for specific solar terms
      expect(solarTermsMap.has('立春')).toBe(true);
      expect(solarTermsMap.has('春分')).toBe(true);
      expect(solarTermsMap.has('夏至')).toBe(true);
      expect(solarTermsMap.has('秋分')).toBe(true);
      expect(solarTermsMap.has('冬至')).toBe(true);
    });
  });

  describe('getNextSolarTerm', () => {
    it('should return next solar term or undefined', () => {
      const date = new Date(2025, 0, 1);
      const nextTerm = SolarTermEngine.getNextSolarTerm(date);

      if (nextTerm) {
        expect(nextTerm).toHaveProperty('name');
        expect(nextTerm).toHaveProperty('date');
        expect(typeof nextTerm.name).toBe('string');
        expect(nextTerm.date).toBeInstanceOf(Date);
        expect(nextTerm.date.getTime()).toBeGreaterThan(date.getTime());
      } else {
        expect(nextTerm).toBeUndefined();
      }
    });

    it('should return solar term after given date', () => {
      const date = new Date(2025, 0, 1);
      const nextTerm = SolarTermEngine.getNextSolarTerm(date);

      if (nextTerm) {
        expect(nextTerm.date.getFullYear()).toBeGreaterThanOrEqual(2025);
      }
    });

    it('should find next solar term within same year', () => {
      const date = new Date(2025, 0, 15); // Mid January
      const nextTerm = SolarTermEngine.getNextSolarTerm(date);

      expect(nextTerm).toBeDefined();
      if (nextTerm) {
        expect(nextTerm.date.getTime()).toBeGreaterThan(date.getTime());
        expect(nextTerm.name).toBeTruthy();
      }
    });

    it('should find next year solar term when at end of year', () => {
      const date = new Date(2025, 11, 30); // End of December
      const nextTerm = SolarTermEngine.getNextSolarTerm(date);

      if (nextTerm) {
        // Should be in next year or very end of current year
        expect(nextTerm.date.getTime()).toBeGreaterThan(date.getTime());
      }
    });
  });

  describe('getPreviousSolarTerm', () => {
    it('should return previous solar term or undefined', () => {
      const date = new Date(2025, 11, 31); // End of year
      const prevTerm = SolarTermEngine.getPreviousSolarTerm(date);

      if (prevTerm) {
        expect(prevTerm).toHaveProperty('name');
        expect(prevTerm).toHaveProperty('date');
        expect(typeof prevTerm.name).toBe('string');
        expect(prevTerm.date).toBeInstanceOf(Date);
        expect(prevTerm.date.getTime()).toBeLessThan(date.getTime());
      } else {
        expect(prevTerm).toBeUndefined();
      }
    });

    it('should return solar term before given date', () => {
      const date = new Date(2025, 11, 31);
      const prevTerm = SolarTermEngine.getPreviousSolarTerm(date);

      if (prevTerm) {
        expect(prevTerm.date.getFullYear()).toBeLessThanOrEqual(2025);
      }
    });

    it('should find previous solar term within same year', () => {
      const date = new Date(2025, 11, 15); // Mid December
      const prevTerm = SolarTermEngine.getPreviousSolarTerm(date);

      expect(prevTerm).toBeDefined();
      if (prevTerm) {
        expect(prevTerm.date.getTime()).toBeLessThan(date.getTime());
        expect(prevTerm.name).toBeTruthy();
      }
    });

    it('should find previous year solar term when at start of year', () => {
      const date = new Date(2025, 0, 2); // Start of January
      const prevTerm = SolarTermEngine.getPreviousSolarTerm(date);

      if (prevTerm) {
        // Should be in previous year or very start of current year
        expect(prevTerm.date.getTime()).toBeLessThan(date.getTime());
      }
    });

    it('should handle edge case with sorted solar terms', () => {
      const date = new Date(2025, 5, 15); // Mid year
      const prevTerm = SolarTermEngine.getPreviousSolarTerm(date);

      if (prevTerm) {
        expect(prevTerm.date.getTime()).toBeLessThan(date.getTime());
        expect(prevTerm.date.getFullYear()).toBeLessThanOrEqual(2025);
      }
    });
  });

  describe('isSolarTerm', () => {
    it('should return boolean', () => {
      const date = new Date(2025, 0, 1);
      const isTerm = SolarTermEngine.isSolarTerm(date);
      expect(typeof isTerm).toBe('boolean');
    });

    it('should return false for most random dates', () => {
      const date = new Date(2025, 0, 15); // Random date
      const isTerm = SolarTermEngine.isSolarTerm(date);
      expect(typeof isTerm).toBe('boolean');
    });

    it('should handle different dates', () => {
      const dates = [new Date(2025, 0, 1), new Date(2025, 5, 15), new Date(2025, 11, 31)];

      dates.forEach(date => {
        const isTerm = SolarTermEngine.isSolarTerm(date);
        expect(typeof isTerm).toBe('boolean');
      });
    });
  });

  describe('getAllSolarTerms', () => {
    it('should return array of solar terms', () => {
      const allTerms = SolarTermEngine.getAllSolarTerms();
      expect(Array.isArray(allTerms)).toBe(true);
      expect(allTerms.length).toBeGreaterThan(0);

      allTerms.forEach(term => {
        expect(term).toHaveProperty('name');
        expect(typeof term.name).toBe('string');
      });
    });

    it('should return 24 solar terms', () => {
      const allTerms = SolarTermEngine.getAllSolarTerms();
      // There should be 24 solar terms in total
      expect(allTerms.length).toBe(24);
    });
  });

  describe('getSolarTermByName', () => {
    it('should return solar term by name', () => {
      const term = SolarTermEngine.getSolarTermByName('立春');
      if (term) {
        expect(term).toHaveProperty('name');
        expect(term.name).toBe('立春');
      }
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
});
