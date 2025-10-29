#!/usr/bin/env node

import { DateInfoEngine } from './dist/engines/dateInfoEngine.js';
import { DateUtils } from './dist/utils/dateUtils.js';
import { Validator } from './dist/utils/validator.js';

/**
 * 测试脚本 - 验证MCP服务的核心功能
 */

console.log('🚀 开始测试中国农历节日转换MCP服务...\n');

// 测试1: 基础日期信息获取
console.log('📅 测试1: 基础日期信息获取');
try {
  const testDate = new Date(2025, 0, 1); // 2025年1月1日
  const dateInfo = DateInfoEngine.getDateInfo(testDate);
  console.log('✅ 2025年1月1日信息:');
  console.log(JSON.stringify(dateInfo, null, 2));
} catch (error) {
  console.error('❌ 测试1失败:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 测试2: 春节期间的日期信息
console.log('📅 测试2: 春节期间的日期信息');
try {
  const springFestival = new Date(2025, 0, 29); // 2025年1月29日（春节）
  const festivalInfo = DateInfoEngine.getDateInfo(springFestival);
  console.log('✅ 2025年春节信息:');
  console.log(JSON.stringify(festivalInfo, null, 2));
} catch (error) {
  console.error('❌ 测试2失败:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 测试3: 日期范围查询
console.log('📅 测试3: 日期范围查询（春节假期）');
try {
  const startDate = new Date(2025, 0, 28); // 2025年1月28日
  const endDate = new Date(2025, 1, 3); // 2025年2月3日
  const rangeInfo = DateInfoEngine.getDateRangeInfo(startDate, endDate);
  console.log('✅ 春节假期范围信息:');
  console.log(`共查询 ${rangeInfo.dates.length} 天`);
  rangeInfo.dates.forEach(dateInfo => {
    console.log(
      `${dateInfo.date} ${dateInfo.week} ${dateInfo.dayType}${dateInfo.adjusted ? ` (${dateInfo.adjusted})` : ''}${dateInfo.festival ? ` - ${dateInfo.festival}` : ''}`,
    );
  });
} catch (error) {
  console.error('❌ 测试3失败:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 测试4: 输入验证测试
console.log('🔍 测试4: 输入验证测试');

const testCases = [
  { date: '2025-01-01', expected: true, desc: '正确格式' },
  { date: '2025-13-01', expected: false, desc: '无效月份' },
  { date: '2025-02-30', expected: false, desc: '无效日期' },
  { date: '25-01-01', expected: false, desc: '年份格式错误' },
  { date: '2025/01/01', expected: false, desc: '分隔符错误' },
  { date: '', expected: false, desc: '空字符串' },
  { date: null, expected: false, desc: 'null值' },
];

testCases.forEach(testCase => {
  const validation = Validator.validateDateString(testCase.date);
  const result = validation.isValid === testCase.expected ? '✅' : '❌';
  console.log(
    `${result} ${testCase.desc}: "${testCase.date}" -> ${validation.isValid ? '有效' : validation.error}`,
  );
});

console.log('\n' + '='.repeat(50) + '\n');

// 测试5: 24节气测试
console.log('🌸 测试5: 24节气测试');
try {
  // 测试立春（通常在2月4日左右）
  const lichun = new Date(2025, 1, 3); // 2025年2月3日
  const lichunInfo = DateInfoEngine.getDateInfo(lichun);
  console.log('✅ 立春节气测试:');
  console.log(JSON.stringify(lichunInfo, null, 2));
} catch (error) {
  console.error('❌ 测试5失败:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 测试6: 工作日判断测试
console.log('💼 测试6: 工作日判断测试');
try {
  const testDates = [
    new Date(2025, 0, 27), // 2025年1月27日（周一，调休工作日）
    new Date(2025, 0, 29), // 2025年1月29日（春节，休息日）
    new Date(2025, 1, 3), // 2025年2月3日（春节假期最后一天）
    new Date(2025, 1, 4), // 2025年2月4日（正常工作日）
  ];

  testDates.forEach(date => {
    const dateInfo = DateInfoEngine.getDateInfo(date);
    console.log(
      `✅ ${dateInfo.date} ${dateInfo.week}: ${dateInfo.dayType}${dateInfo.adjusted ? ` (${dateInfo.adjusted})` : ''}`,
    );
  });
} catch (error) {
  console.error('❌ 测试6失败:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 测试7: 边界条件测试
console.log('⚠️  测试7: 边界条件测试');
try {
  // 测试日期范围限制
  const startDate = new Date(2025, 0, 1);
  const endDate = new Date(2026, 0, 3); // 367天，超过366天限制

  try {
    DateInfoEngine.getDateRangeInfo(startDate, endDate);
    console.log('❌ 应该抛出范围过大错误');
  } catch (error) {
    console.log('✅ 正确捕获范围过大错误:', error.message);
  }
} catch (error) {
  console.error('❌ 测试7失败:', error.message);
}

console.log('\n🎉 测试完成！');

// 性能测试
console.log('\n⚡ 性能测试: 查询一个月的数据');
const perfStart = Date.now();
try {
  const monthStart = new Date(2025, 0, 1);
  const monthEnd = new Date(2025, 0, 31);
  const monthData = DateInfoEngine.getDateRangeInfo(monthStart, monthEnd);
  const perfEnd = Date.now();
  console.log(`✅ 查询31天数据耗时: ${perfEnd - perfStart}ms`);
  console.log(`✅ 返回数据量: ${monthData.dates.length} 条记录`);
} catch (error) {
  console.error('❌ 性能测试失败:', error.message);
}
