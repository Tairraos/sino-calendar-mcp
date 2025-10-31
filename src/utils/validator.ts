/**
 * 输入验证工具类
 */
export class Validator {
  /**
   * 验证日期字符串格式
   * @param dateStr 日期字符串
   * @returns 验证结果
   */
  static validateDateString(dateStr: any): { isValid: boolean; error?: string } {
    if (typeof dateStr !== 'string') {
      return { isValid: false, error: '日期必须是字符串类型' };
    }

    if (!dateStr.trim()) {
      return { isValid: false, error: '日期不能为空' };
    }

    // 检查格式
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateStr)) {
      return { isValid: false, error: '日期格式无效，请使用YYYY-MM-DD格式，如：2025-01-01' };
    }

    // 检查日期有效性
    const [year, month, day] = dateStr.split('-').map(Number);

    if (year < 1900 || year > 2100) {
      return { isValid: false, error: '年份必须在1900-2100之间' };
    }

    if (month < 1 || month > 12) {
      return { isValid: false, error: '月份必须在1-12之间' };
    }

    if (day < 1 || day > 31) {
      return { isValid: false, error: '日期必须在1-31之间' };
    }

    // 检查具体日期是否存在
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return { isValid: false, error: '日期不存在，请检查年月日是否正确' };
    }

    return { isValid: true };
  }

  /**
   * 验证日期范围
   * @param startDateStr 开始日期字符串
   * @param endDateStr 结束日期字符串
   * @returns 验证结果
   */
  static validateDateRange(
    startDateStr: any,
    endDateStr: any,
  ): { isValid: boolean; error?: string } {
    // 验证开始日期
    const startValidation = this.validateDateString(startDateStr);
    if (!startValidation.isValid) {
      return { isValid: false, error: `开始日期错误: ${startValidation.error}` };
    }

    // 验证结束日期
    const endValidation = this.validateDateString(endDateStr);
    if (!endValidation.isValid) {
      return { isValid: false, error: `结束日期错误: ${endValidation.error}` };
    }

    // 检查日期顺序
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (startDate > endDate) {
      return { isValid: false, error: '开始日期不能晚于结束日期' };
    }

    // 检查日期范围大小
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 366) {
      return { isValid: false, error: '查询范围不能超过366天（一年）' };
    }

    return { isValid: true };
  }

  /**
   * 验证工具参数
   * @param toolName 工具名称
   * @param args 参数对象
   * @returns 验证结果
   */
  static validateToolArgs(toolName: string, args: any): { isValid: boolean; error?: string } {
    if (!args || typeof args !== 'object') {
      return { isValid: false, error: '参数必须是对象类型' };
    }

    switch (toolName) {
      case 'get_date_info':
        return this.validateGetDateInfoArgs(args);

      case 'get_date_range_info':
        return this.validateGetDateRangeInfoArgs(args);

      case 'reverse_query_by_name':
        return this.validateReverseQueryByNameArgs(args);

      case 'query_by_date_range':
        return this.validateQueryByDateRangeArgs(args);

      default:
        return { isValid: false, error: `未知的工具: ${toolName}` };
    }
  }

  /**
   * 验证get_date_info工具的参数
   */
  private static validateGetDateInfoArgs(args: any): { isValid: boolean; error?: string } {
    if (!Object.prototype.hasOwnProperty.call(args, 'date')) {
      return { isValid: false, error: '缺少必需参数: date' };
    }

    return this.validateDateString(args.date);
  }

  /**
   * 验证get_date_range_info工具的参数
   */
  private static validateGetDateRangeInfoArgs(args: any): { isValid: boolean; error?: string } {
    if (!Object.prototype.hasOwnProperty.call(args, 'startDate')) {
      return { isValid: false, error: '缺少必需参数: startDate' };
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'endDate')) {
      return { isValid: false, error: '缺少必需参数: endDate' };
    }

    return this.validateDateRange(args.startDate, args.endDate);
  }

  /**
   * 验证年份
   * @param year 年份
   * @returns 验证结果
   */
  static validateYear(year: any): { isValid: boolean; error?: string } {
    if (typeof year !== 'number') {
      return { isValid: false, error: '年份必须是数字类型' };
    }

    if (!Number.isInteger(year)) {
      return { isValid: false, error: '年份必须是整数' };
    }

    if (year < 1900 || year > 2100) {
      return { isValid: false, error: '年份必须在1900-2100之间' };
    }

    return { isValid: true };
  }

  /**
   * 验证月份
   * @param month 月份
   * @returns 验证结果
   */
  static validateMonth(month: any): { isValid: boolean; error?: string } {
    if (typeof month !== 'number') {
      return { isValid: false, error: '月份必须是数字类型' };
    }

    if (!Number.isInteger(month)) {
      return { isValid: false, error: '月份必须是整数' };
    }

    if (month < 1 || month > 12) {
      return { isValid: false, error: '月份必须在1-12之间' };
    }

    return { isValid: true };
  }

  /**
   * 验证反向查询参数
   * @param args 参数对象
   * @returns 验证结果
   */
  private static validateReverseQueryByNameArgs(args: any): { isValid: boolean; error?: string } {
    if (!Object.prototype.hasOwnProperty.call(args, 'query')) {
      return { isValid: false, error: '缺少必需参数: query' };
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'type')) {
      return { isValid: false, error: '缺少必需参数: type' };
    }

    // 验证查询内容
    if (typeof args.query !== 'string' || !args.query.trim()) {
      return { isValid: false, error: '查询内容必须是有效的字符串' };
    }

    // 验证查询类型
    const validTypes = ['lunar', 'festival', 'solar_term'];
    if (!validTypes.includes(args.type)) {
      return { isValid: false, error: '查询类型必须是: lunar, festival, solar_term 之一' };
    }

    // 验证年份（可选参数）
    if (args.year !== undefined) {
      const yearValidation = this.validateYear(args.year);
      if (!yearValidation.isValid) {
        return yearValidation;
      }
    }

    return { isValid: true };
  }

  /**
   * 验证日期范围条件查询参数
   * @param args 参数对象
   * @returns 验证结果
   */
  private static validateQueryByDateRangeArgs(args: any): { isValid: boolean; error?: string } {
    if (!Object.prototype.hasOwnProperty.call(args, 'startDate')) {
      return { isValid: false, error: '缺少必需参数: startDate' };
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'endDate')) {
      return { isValid: false, error: '缺少必需参数: endDate' };
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'type')) {
      return { isValid: false, error: '缺少必需参数: type' };
    }

    // 验证日期范围
    const dateRangeValidation = this.validateDateRange(args.startDate, args.endDate);
    if (!dateRangeValidation.isValid) {
      return dateRangeValidation;
    }

    // 验证查询类型
    const validTypes = ['rest_days', 'work_days', 'festivals', 'solar_terms'];
    if (!validTypes.includes(args.type)) {
      return { isValid: false, error: '查询类型必须是: rest_days, work_days, festivals, solar_terms 之一' };
    }

    return { isValid: true };
  }

  /**
   * 验证农历日期字符串
   * @param lunarDateStr 农历日期字符串
   * @returns 验证结果
   */
  static validateLunarDateString(lunarDateStr: any): { isValid: boolean; error?: string } {
    if (typeof lunarDateStr !== 'string') {
      return { isValid: false, error: '农历日期必须是字符串类型' };
    }

    if (!lunarDateStr.trim()) {
      return { isValid: false, error: '农历日期不能为空' };
    }

    // 检查农历日期格式
    const lunarPattern = /农历\d{4}年(闰?)[正一二三四五六七八九十冬腊]+月[初一二三四五六七八九十廿]+/;
    if (!lunarPattern.test(lunarDateStr)) {
      return { isValid: false, error: '农历日期格式无效，如：农历2025年正月初一' };
    }

    return { isValid: true };
  }

  /**
   * 验证节日名称
   * @param festivalName 节日名称
   * @returns 验证结果
   */
  static validateFestivalName(festivalName: any): { isValid: boolean; error?: string } {
    if (typeof festivalName !== 'string') {
      return { isValid: false, error: '节日名称必须是字符串类型' };
    }

    if (!festivalName.trim()) {
      return { isValid: false, error: '节日名称不能为空' };
    }

    // 支持的主要节日名称
    const validFestivals = [
      '春节', '元宵节', '清明节', '端午节', '七夕节', '中秋节', '重阳节',
      '除夕', '元旦', '劳动节', '国庆节', '儿童节', '妇女节', '教师节',
      '情人节', '圣诞节', '万圣节', '感恩节'
    ];

    if (!validFestivals.some(festival => festivalName.includes(festival) || festival.includes(festivalName))) {
      return { isValid: false, error: '不支持的节日名称' };
    }

    return { isValid: true };
  }

  /**
   * 验证节气名称
   * @param termName 节气名称
   * @returns 验证结果
   */
  static validateSolarTermName(termName: any): { isValid: boolean; error?: string } {
    if (typeof termName !== 'string') {
      return { isValid: false, error: '节气名称必须是字符串类型' };
    }

    if (!termName.trim()) {
      return { isValid: false, error: '节气名称不能为空' };
    }

    // 24节气名称
    const validTerms = [
      '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
      '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
      '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
      '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
    ];

    if (!validTerms.includes(termName)) {
      return { isValid: false, error: '不支持的节气名称' };
    }

    return { isValid: true };
  }
}
