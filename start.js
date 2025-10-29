#!/usr/bin/env node

/**
 * 中国农历节日转换MCP服务启动脚本
 *
 * 使用方法：
 * 1. 直接运行：node start.js
 * 2. 通过npm：npm start
 * 3. 作为MCP服务器：在MCP客户端配置中使用
 */

import { SinoCalendarMCPServer } from './dist/index.js';

async function main() {
  console.error('🚀 正在启动中国农历节日转换MCP服务...');

  try {
    const server = new SinoCalendarMCPServer();
    await server.start();

    console.error('✅ 服务启动成功！');
    console.error('📋 可用工具：');
    console.error('   - get_date_info: 获取指定日期的完整信息');
    console.error('   - get_date_range_info: 获取日期范围内所有日期的信息');
    console.error('');
    console.error('💡 提示：此服务通过标准输入/输出与MCP客户端通信');
    console.error('   如需测试，请使用MCP客户端或运行 npm test');
  } catch (error) {
    console.error('❌ 服务启动失败:', error.message);
    console.error('');
    console.error('🔧 故障排除：');
    console.error('   1. 确保已安装依赖：npm install');
    console.error('   2. 确保已编译代码：npm run build');
    console.error('   3. 检查Node.js版本：需要 >= 18.0.0');
    process.exit(1);
  }
}

// 处理进程信号
process.on('SIGINT', () => {
  console.error('\n🛑 收到中断信号，正在关闭服务...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\n🛑 收到终止信号，正在关闭服务...');
  process.exit(0);
});

// 处理未捕获的异常
process.on('uncaughtException', error => {
  console.error('❌ 未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  console.error('❌ 未处理的Promise拒绝:', reason);
  process.exit(1);
});

// 启动服务
main();
