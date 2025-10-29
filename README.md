# 中国农历节日转换MCP服务

一个基于Model Context Protocol (MCP) 的中国农历节日转换服务，提供公历与农历转换、传统节日识别、24节气计算、工作日判断等功能。

**开发日期**: 2025年10月29日  
**开发者**: Tairraos

## 🌟 功能特性

- **农历转换**：公历日期转换为农历格式（天干地支年份）
- **节日识别**：识别传统节日（春节、中秋节、端午节等）和现代节日
- **24节气**：准确计算24节气日期
- **工作日判断**：支持法定节假日和调休规律
- **日期范围查询**：批量获取日期范围内的信息
- **输入验证**：完善的日期格式验证和错误处理

## 📦 安装与配置

### 环境要求

- Node.js >= 18.0.0
- npm 或 pnpm

### 安装依赖

```bash
# 使用npm
npm install

# 或使用pnpm
pnpm install
```

### 编译项目

```bash
npm run build
```

## 🚀 使用方法

### 1. 直接启动服务

```bash
# 方式1：使用启动脚本
node start.js

# 方式2：使用npm脚本
npm start

# 方式3：直接运行编译后的文件
node dist/index.js
```

### 2. 作为MCP服务器

在MCP客户端配置文件中添加：

```json
{
  "mcpServers": {
    "sino-calendar": {
      "command": "node",
      "args": ["/path/to/sino-calendar-mcp/start.js"],
      "env": {}
    }
  }
}
```

### 3. 运行测试

```bash
# 运行功能测试
npm test

# 运行编译检查
npm run check
```

## 🛠️ API 接口

### get_date_info

获取指定日期的完整信息。

**参数：**
- `date` (string): 日期，格式为 YYYY-MM-DD

**示例：**
```json
{
  "name": "get_date_info",
  "arguments": {
    "date": "2025-01-29"
  }
}
```

**返回：**
```json
{
  "date": "2025年1月29日",
  "week": "星期三",
  "dayType": "休息日",
  "lunarDate": "乙巳年正月初一",
  "adjusted": "调休",
  "festival": "春节"
}
```

### get_date_range_info

获取日期范围内所有日期的信息。

**参数：**
- `startDate` (string): 开始日期，格式为 YYYY-MM-DD
- `endDate` (string): 结束日期，格式为 YYYY-MM-DD

**限制：**
- 日期范围不能超过366天

**示例：**
```json
{
  "name": "get_date_range_info",
  "arguments": {
    "startDate": "2025-01-28",
    "endDate": "2025-02-03"
  }
}
```

**返回：**
```json
{
  "dates": [
    {
      "date": "2025年1月28日",
      "week": "星期二",
      "dayType": "休息日",
      "lunarDate": "乙巳年腊月廿九",
      "adjusted": "调休",
      "festival": "除夕"
    },
    // ... 更多日期信息
  ]
}
```

## 📊 数据字段说明

### 基础字段

- `date`: 中文格式的公历日期
- `week`: 中文格式的星期
- `dayType`: 日期类型（"工作日" | "休息日"）
- `lunarDate`: 农历日期（天干地支年份 + 月份 + 日期）

### 可选字段

- `adjusted`: 调休信息（"调休" | "补班"）
- `festival`: 节日名称
- `solarTerm`: 24节气名称

### 日期类型说明

- **工作日**: 正常工作日
- **休息日**: 周末或法定节假日
- **调休**: 因节假日调整的休息日
- **补班**: 因节假日调整的工作日

## 🎯 支持的节日

### 传统节日
- 春节、元宵节、清明节、端午节、七夕节、中秋节、重阳节、腊八节、除夕

### 现代节日
- 元旦、妇女节、劳动节、青年节、儿童节、建党节、建军节、教师节、国庆节

### 24节气
- 立春、雨水、惊蛰、春分、清明、谷雨
- 立夏、小满、芒种、夏至、小暑、大暑
- 立秋、处暑、白露、秋分、寒露、霜降
- 立冬、小雪、大雪、冬至、小寒、大寒

## 🔧 开发指南

### 项目结构

```
sino-calendar-mcp/
├── src/                    # 源代码
│   ├── engines/           # 业务引擎
│   │   ├── dateInfoEngine.ts    # 日期信息引擎
│   │   ├── lunarEngine.ts       # 农历转换引擎
│   │   ├── festivalEngine.ts    # 节日识别引擎
│   │   ├── solarTermEngine.ts   # 24节气引擎
│   │   └── workdayEngine.ts     # 工作日判断引擎
│   ├── data/              # 数据文件
│   │   ├── festivals.ts         # 节日数据
│   │   ├── solarTerms.ts        # 24节气数据
│   │   └── workdayRules.ts      # 工作日规则
│   ├── utils/             # 工具类
│   │   ├── dateUtils.ts         # 日期工具
│   │   ├── validator.ts         # 输入验证
│   │   └── errorHandler.ts      # 错误处理
│   ├── types/             # 类型定义
│   │   ├── index.ts             # 主要类型
│   │   └── lunar-javascript.d.ts # 第三方库类型
│   └── index.ts           # 主入口文件
├── dist/                  # 编译输出
├── test.js               # 测试脚本
├── start.js              # 启动脚本
└── README.md             # 使用说明
```

### 添加新节日

1. 在 `src/data/festivals.ts` 中添加节日定义
2. 更新 `FestivalEngine` 的识别逻辑
3. 运行测试确保功能正常

### 添加新的工作日规则

1. 在 `src/data/workdayRules.ts` 中添加规则
2. 更新 `WorkdayEngine` 的判断逻辑
3. 运行测试验证准确性

## 🐛 故障排除

### 常见问题

1. **编译错误**
   ```bash
   npm run build
   ```

2. **依赖问题**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Node.js版本过低**
   - 确保使用 Node.js 18.0.0 或更高版本

4. **日期解析错误**
   - 确保日期格式为 YYYY-MM-DD
   - 检查日期是否有效（如2月30日无效）

### 调试模式

设置环境变量启用详细日志：

```bash
DEBUG=sino-calendar:* node start.js
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 👨‍💻 开发者

**Tairraos** - 项目创建者和维护者  
开发时间：2025年10月29日

## 📞 支持

如有问题，请通过以下方式联系：

- 提交 GitHub Issue
- 查看项目文档
- 运行测试脚本进行自检

---

**注意**: 本服务基于 `lunar-javascript` 库进行农历计算，节日和工作日数据基于中国大陆的法定规定。