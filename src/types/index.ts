/**
 * 日期信息接口
 */
export interface DateInfo {
  /** 中文日期格式，如：2025年9月5日 */
  date: string;
  /** 中文星期，如：星期五 */
  week: string;
  /** 工作日类型：工作日/休息日 */
  dayType: string;
  /** 调休标识：调休（可选） */
  adjusted?: string;
  /** 节日名称（可选） */
  festival?: string;
  /** 24节气名称（可选） */
  solarTerm?: string;
  /** 农历日期，如：壬辰年闰四月初六 */
  lunarDate: string;
}

/**
 * 节日数据接口
 */
export interface Festival {
  /** 节日名称 */
  name: string;
  /** 节日类型 */
  type: 'solar' | 'lunar' | 'western';
  /** 日期（MM-DD或农历格式） */
  date: string;
  /** 是否固定日期 */
  isFixed: boolean;
}

/**
 * 24节气数据接口
 */
export interface SolarTerm {
  /** 节气名称 */
  name: string;
  /** 太阳黄经度数 */
  longitude: number;
  /** 节气顺序 */
  order: number;
}

/**
 * 调休规则接口
 */
export interface AdjustmentRule {
  /** 年份 */
  year: number;
  /** 节日名称 */
  holiday: string;
  /** 放假日期 */
  holidayDates: string[];
  /** 调休工作日期 */
  workingDates: string[];
}

/**
 * 日期范围查询响应接口
 */
export interface DateRangeResponse {
  /** 日期信息数组 */
  dates: DateInfo[];
}
