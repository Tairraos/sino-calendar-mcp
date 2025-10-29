/**
 * 24节气计算引擎
 */
export declare class SolarTermEngine {
    /**
     * 获取指定日期的24节气
     * @param date 日期
     * @returns 节气名称，如果不是节气则返回null
     */
    static getSolarTerm(date: Date): string | null;
    /**
     * 获取指定年份的所有24节气
     * @param year 年份
     * @returns 节气名称到日期的映射
     */
    static getYearSolarTerms(year: number): Map<string, Date>;
    /**
     * 获取下一个节气
     * @param date 当前日期
     * @returns 下一个节气的名称和日期
     */
    static getNextSolarTerm(date: Date): {
        name: string;
        date: Date;
    } | undefined;
    /**
     * 获取上一个节气
     * @param date 当前日期
     * @returns 上一个节气的名称和日期
     */
    static getPreviousSolarTerm(date: Date): {
        name: string;
        date: Date;
    } | undefined;
    /**
     * 检查指定日期是否为24节气
     * @param date 日期
     * @returns 是否为节气
     */
    static isSolarTerm(date: Date): boolean;
    /**
     * 获取所有24节气列表
     */
    static getAllSolarTerms(): import("../types/index.js").SolarTerm[];
    /**
     * 根据节气名称获取节气信息
     * @param name 节气名称
     * @returns 节气信息
     */
    static getSolarTermByName(name: string): import("../types/index.js").SolarTerm | undefined;
}
