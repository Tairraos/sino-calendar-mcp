import { FestivalEngine } from '../../../src/engines/festivalEngine';

describe('FestivalEngine', () => {
  describe('getFestival', () => {
    it('should return correct festival for New Year', () => {
      const date = new Date(2025, 0, 1); // 2025-01-01
      const festival = FestivalEngine.getFestival(date);
      expect(festival).toBe('元旦');
    });

    it('should return correct festival for Christmas', () => {
      const date = new Date(2025, 11, 25); // 2025-12-25
      const festival = FestivalEngine.getFestival(date);
      expect(festival).toBe('圣诞节');
    });

    it("should return correct festival for Valentine's Day", () => {
      const date = new Date(2025, 1, 14); // 2025-02-14
      const festival = FestivalEngine.getFestival(date);
      expect(festival).toBe('情人节');
    });

    it('should return correct festival for Halloween', () => {
      const date = new Date(2025, 9, 31); // 2025-10-31
      const festival = FestivalEngine.getFestival(date);
      expect(festival).toBe('万圣节');
    });

    it('should return undefined for non-festival dates', () => {
      const date = new Date(2025, 0, 15); // 2025-01-15 (random date)
      const festival = FestivalEngine.getFestival(date);
      expect(festival).toBeUndefined();
    });
  });

  describe('lunar festivals', () => {
    it('should return correct lunar festival for Spring Festival', () => {
      const date = new Date(2025, 0, 29); // 2025-01-29 (Spring Festival 2025)
      const festival = FestivalEngine.getFestival(date);
      expect(festival).toBe('春节');
    });
  });

  describe('western festivals', () => {
    it("should return correct western festival for Mother's Day", () => {
      // Mother's Day is second Sunday of May
      const date = new Date(2025, 4, 11); // 2025-05-11 (second Sunday of May 2025)
      const festival = FestivalEngine.getFestival(date);
      expect(festival).toBe('母亲节');
    });

    it("should return correct western festival for Father's Day", () => {
      // Father's Day is third Sunday of June
      const date = new Date(2025, 5, 15); // 2025-06-15 (third Sunday of June 2025)
      const festival = FestivalEngine.getFestival(date);
      expect(festival).toBe('父亲节');
    });

    it('should return correct western festival for Thanksgiving', () => {
      // Thanksgiving is fourth Thursday of November
      const date = new Date(2025, 10, 27); // 2025-11-27 (fourth Thursday of November 2025)
      const festival = FestivalEngine.getFestival(date);
      expect(festival).toBe('感恩节');
    });
  });

  describe('getAllFestivals', () => {
    it('should return array of all festivals', () => {
      const festivals = FestivalEngine.getAllFestivals();
      expect(Array.isArray(festivals)).toBe(true);
      expect(festivals.length).toBeGreaterThan(0);

      // Check if it includes some known festivals
      const festivalNames = festivals.map(f => f.name);
      expect(festivalNames).toContain('元旦');
      expect(festivalNames).toContain('春节');
      expect(festivalNames).toContain('圣诞节');
      expect(festivalNames).toContain('情人节');
      expect(festivalNames).toContain('万圣节');
      expect(festivalNames).toContain('复活节');
      expect(festivalNames).toContain('感恩节');
    });

    it('should include different types of festivals', () => {
      const festivals = FestivalEngine.getAllFestivals();
      const solarFestivals = festivals.filter(f => f.type === 'solar');
      const lunarFestivals = festivals.filter(f => f.type === 'lunar');
      const westernFestivals = festivals.filter(f => f.type === 'western');

      expect(solarFestivals.length).toBeGreaterThan(0);
      expect(lunarFestivals.length).toBeGreaterThan(0);
      expect(westernFestivals.length).toBeGreaterThan(0);
    });
  });

  describe('getFestivalsByDate', () => {
    it('should return festival array for festival dates', () => {
      const date = new Date(2025, 11, 25); // Christmas
      const festivals = FestivalEngine.getFestivalsByDate(date);
      expect(Array.isArray(festivals)).toBe(true);
      expect(festivals.length).toBeGreaterThan(0);
      expect(festivals[0].name).toBe('圣诞节');
    });

    it('should return empty array for non-festival dates', () => {
      const date = new Date(2025, 0, 15); // Random date
      const festivals = FestivalEngine.getFestivalsByDate(date);
      expect(Array.isArray(festivals)).toBe(true);
      expect(festivals.length).toBe(0);
    });
  });

  describe('getFestivalsByType', () => {
    it('should return solar festivals', () => {
      const solarFestivals = FestivalEngine.getFestivalsByType('solar');
      expect(Array.isArray(solarFestivals)).toBe(true);
      expect(solarFestivals.length).toBeGreaterThan(0);
      expect(solarFestivals.every(f => f.type === 'solar')).toBe(true);
    });

    it('should return lunar festivals', () => {
      const lunarFestivals = FestivalEngine.getFestivalsByType('lunar');
      expect(Array.isArray(lunarFestivals)).toBe(true);
      expect(lunarFestivals.length).toBeGreaterThan(0);
      expect(lunarFestivals.every(f => f.type === 'lunar')).toBe(true);
    });

    it('should return western festivals', () => {
      const westernFestivals = FestivalEngine.getFestivalsByType('western');
      expect(Array.isArray(westernFestivals)).toBe(true);
      expect(westernFestivals.length).toBeGreaterThan(0);
      expect(westernFestivals.every(f => f.type === 'western')).toBe(true);
    });

    it('should return empty array for unknown type', () => {
      const unknownFestivals = FestivalEngine.getFestivalsByType('unknown');
      expect(Array.isArray(unknownFestivals)).toBe(true);
      expect(unknownFestivals.length).toBe(0);
    });
  });
});
