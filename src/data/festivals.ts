import { Festival } from '../types/index.js';

/**
 * 节日数据配置
 * 包含中西方节日、公历农历节日
 */
export const festivals: Festival[] = [
  // 公历节日
  { name: '元旦', type: 'solar', date: '01-01', isFixed: true },
  { name: '情人节', type: 'western', date: '02-14', isFixed: true },
  { name: '妇女节', type: 'solar', date: '03-08', isFixed: true },
  { name: '植树节', type: 'solar', date: '03-12', isFixed: true },
  { name: '愚人节', type: 'western', date: '04-01', isFixed: true },
  { name: '复活节', type: 'western', date: 'easter', isFixed: false },
  { name: '劳动节', type: 'solar', date: '05-01', isFixed: true },
  { name: '青年节', type: 'solar', date: '05-04', isFixed: true },
  { name: '母亲节', type: 'western', date: '05-second-sunday', isFixed: false },
  { name: '儿童节', type: 'solar', date: '06-01', isFixed: true },
  { name: '父亲节', type: 'western', date: '06-third-sunday', isFixed: false },
  { name: '建党节', type: 'solar', date: '07-01', isFixed: true },
  { name: '建军节', type: 'solar', date: '08-01', isFixed: true },
  { name: '教师节', type: 'solar', date: '09-10', isFixed: true },
  { name: '国庆节', type: 'solar', date: '10-01', isFixed: true },
  { name: '万圣节', type: 'western', date: '10-31', isFixed: true },
  { name: '感恩节', type: 'western', date: '11-fourth-thursday', isFixed: false },
  { name: '圣诞节', type: 'western', date: '12-25', isFixed: true },

  // 农历节日
  { name: '春节', type: 'lunar', date: '01-01', isFixed: true },
  { name: '元宵节', type: 'lunar', date: '01-15', isFixed: true },
  { name: '龙抬头', type: 'lunar', date: '02-02', isFixed: true },
  { name: '上巳节', type: 'lunar', date: '03-03', isFixed: true },
  { name: '寒食节', type: 'lunar', date: '清明前一日', isFixed: false },
  { name: '端午节', type: 'lunar', date: '05-05', isFixed: true },
  { name: '七夕节', type: 'lunar', date: '07-07', isFixed: true },
  { name: '中元节', type: 'lunar', date: '07-15', isFixed: true },
  { name: '中秋节', type: 'lunar', date: '08-15', isFixed: true },
  { name: '重阳节', type: 'lunar', date: '09-09', isFixed: true },
  { name: '寒衣节', type: 'lunar', date: '10-01', isFixed: true },
  { name: '下元节', type: 'lunar', date: '10-15', isFixed: true },
  { name: '腊八节', type: 'lunar', date: '12-08', isFixed: true },
  { name: '小年', type: 'lunar', date: '12-23', isFixed: true },
  { name: '除夕', type: 'lunar', date: '12-30', isFixed: false }, // 平年29日，闰年30日
];
