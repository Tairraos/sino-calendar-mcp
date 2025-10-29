import { SolarTerm } from '../types/index.js';

/**
 * 24节气数据配置
 * 基于太阳黄经度数计算
 */
export const solarTerms: SolarTerm[] = [
  { name: '立春', longitude: 315, order: 1 },
  { name: '雨水', longitude: 330, order: 2 },
  { name: '惊蛰', longitude: 345, order: 3 },
  { name: '春分', longitude: 0, order: 4 },
  { name: '清明', longitude: 15, order: 5 },
  { name: '谷雨', longitude: 30, order: 6 },
  { name: '立夏', longitude: 45, order: 7 },
  { name: '小满', longitude: 60, order: 8 },
  { name: '芒种', longitude: 75, order: 9 },
  { name: '夏至', longitude: 90, order: 10 },
  { name: '小暑', longitude: 105, order: 11 },
  { name: '大暑', longitude: 120, order: 12 },
  { name: '立秋', longitude: 135, order: 13 },
  { name: '处暑', longitude: 150, order: 14 },
  { name: '白露', longitude: 165, order: 15 },
  { name: '秋分', longitude: 180, order: 16 },
  { name: '寒露', longitude: 195, order: 17 },
  { name: '霜降', longitude: 210, order: 18 },
  { name: '立冬', longitude: 225, order: 19 },
  { name: '小雪', longitude: 240, order: 20 },
  { name: '大雪', longitude: 255, order: 21 },
  { name: '冬至', longitude: 270, order: 22 },
  { name: '小寒', longitude: 285, order: 23 },
  { name: '大寒', longitude: 300, order: 24 },
];
