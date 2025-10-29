declare module 'lunar-javascript' {
  export class Solar {
    constructor(year: number, month: number, day: number);

    static fromDate(date: Date): Solar;
    static fromYmd(year: number, month: number, day: number): Solar;

    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getWeek(): number;
    getWeekInChinese(): string;

    getLunar(): Lunar;
    getJieQi(): string;
    getJieQiTable(): { [key: string]: Solar };

    toYmd(): string;
    toString(): string;
    toFullString(): string;
  }

  export class Lunar {
    constructor(
      year: number,
      month: number,
      day: number,
      hour?: number,
      minute?: number,
      second?: number,
    );

    leap: number; // 闰月，0表示非闰月

    static fromDate(date: Date): Lunar;
    static fromYmd(year: number, month: number, day: number): Lunar;
    static fromSolar(solar: Solar): Lunar;
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
    ): Lunar;

    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;

    getYearInChinese(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getTimeInGanZhi(): string;
    getYearShengXiao(): string;
    getMonthShengXiao(): string;
    getDayShengXiao(): string;
    getTimeShengXiao(): string;
    getYearNaYin(): string;
    getMonthNaYin(): string;
    getDayNaYin(): string;
    getTimeNaYin(): string;
    getEightChar(): string;

    getSolar(): Solar;
    getFestivals(): string[];
    getJieQi(): string;
    getJie(): string;
    getQi(): string;

    toString(): string;
    toFullString(): string;
  }

  export class LunarYear {
    constructor(year: number);

    getYear(): number;
    getLeapMonth(): number;
    getMonths(): LunarMonth[];
    getMonth(month: number): LunarMonth;

    toString(): string;
  }

  export class LunarMonth {
    constructor(year: number, month: number, dayCount: number, firstJulianDay: number);

    getYear(): number;
    getMonth(): number;
    getDayCount(): number;
    getFirstJulianDay(): number;

    getDays(): LunarDay[];
    getDay(day: number): LunarDay;

    toString(): string;
  }

  export class LunarDay {
    constructor(year: number, month: number, day: number);

    getYear(): number;
    getMonth(): number;
    getDay(): number;

    toString(): string;
  }

  export class HolidayUtil {
    static getHoliday(year: number, month: number, day: number): Holiday | null;
    static getHolidays(year: number): Holiday[];
  }

  export class Holiday {
    getName(): string;
    getTarget(): string;
    isWork(): boolean;

    toString(): string;
  }

  export class SolarUtil {
    static getDaysOfMonth(year: number, month: number): number;
    static isLeapYear(year: number): boolean;
    static getWeeksOfMonth(year: number, month: number, start: number): number;
  }

  export class LunarUtil {
    static MONTH_NAME: string[];
    static DAY_NAME: string[];
    static JIE_QI: string[];
    static JIE_QI_IN_USE: string[];

    static getJieQiInUse(): string[];
    static convertJieQi(name: string): string;
    static getDayName(day: number): string;
    static getMonthName(month: number): string;
  }
}
