# 反向查询功能技术设计文档

## 1. 功能概述

反向查询功能允许用户通过农历日期、节日名称、节气名称等条件反向查询对应的公历日期，或在指定日期范围内查询符合条件的日期集合。

## 2. 接口设计

### 2.1 接口1：汉字反向查询

**接口名称**: `reverse_query_by_name`

**输入参数**:
- `query`: string - 查询内容（农历日期、节日名称、节气名称）
- `type`: string - 查询类型（'lunar' | 'festival' | 'solar_term'）
- `year`?: number - 指定年份（可选，不指定则查询前后5年）

**返回格式**: 同 `get_date_info` 接口格式

**查询范围**: 
- 指定年份：查询该年份的所有匹配日期
- 未指定年份：查询过去5年到未来5年（共11年）的所有匹配日期

### 2.2 接口2：日期范围条件查询

**接口名称**: `query_by_date_range`

**输入参数**:
- `start_date`: string - 开始日期（YYYY-MM-DD）
- `end_date`: string - 结束日期（YYYY-MM-DD）
- `type`: string - 查询类型（'rest_days' | 'work_days' | 'festivals' | 'solar_terms'）

**返回格式**: 同 `get_date_range_info` 接口格式

**查询类型说明**:
- `rest_days`: 查询所有休息日（周末和节假日）
- `work_days`: 查询所有工作日（需要补班的节假日也算工作日）
- `festivals`: 查询所有包含节日的日期
- `solar_terms`: 查询所有包含节气的日期

## 3. 数据流程设计

### 3.1 输入验证流程

```
输入参数 → 格式验证 → 业务规则验证 → 查询执行 → 结果格式化 → 返回
```

**验证规则**:
- 日期格式：YYYY-MM-DD
- 查询类型：限定枚举值
- 日期范围：开始日期 ≤ 结束日期，范围不超过1年
- 农历日期格式：农历YYYY年MM月DD日
- 节日名称：支持常用节日名称
- 节气名称：支持24节气名称

### 3.2 反向查询算法设计

#### 农历日期反向查询算法

```
1. 解析农历日期字符串，提取年月日
2. 遍历查询年份范围（指定年份或前后5年）
3. 对每个年份的每个月，检查是否有对应的农历日期
4. 考虑闰月情况，一个农历月份可能对应多个公历日期
5. 收集所有匹配的公历日期
6. 对每个匹配日期调用 get_date_info 获取详细信息
```

#### 节日名称反向查询算法

```
1. 建立节日名称到节日日期的映射表
2. 根据节日名称查找对应的节日规则
3. 遍历查询年份范围
4. 根据节日规则计算每年的具体日期
5. 收集所有匹配的公历日期
6. 对每个匹配日期调用 get_date_info 获取详细信息
```

#### 节气名称反向查询算法

```
1. 建立节气名称到节气索引的映射表
2. 根据节气名称查找对应的节气索引（0-23）
3. 遍历查询年份范围
4. 使用现有的节气计算逻辑获取每年该节气的具体日期
5. 收集所有匹配的公历日期
6. 对每个匹配日期调用 get_date_info 获取详细信息
```

### 3.3 日期范围查询算法

#### 休息日查询算法

```
1. 遍历指定日期范围内的每一天
2. 检查是否为周六或周日
3. 检查是否为节假日（通过节日信息判断）
4. 排除需要补班的节假日
5. 收集所有休息日
```

#### 工作日查询算法

```
1. 遍历指定日期范围内的每一天
2. 检查是否为周一至周五
3. 检查是否需要补班（节假日调休）
4. 排除周末的节假日
5. 收集所有工作日
```

#### 节日日期查询算法

```
1. 遍历指定日期范围内的每一天
2. 调用 get_date_info 获取当天的详细信息
3. 检查是否包含节日信息
4. 收集所有包含节日的日期
```

#### 节气日期查询算法

```
1. 遍历指定日期范围内的每一天
2. 调用 get_date_info 获取当天的详细信息
3. 检查是否包含节气信息
4. 收集所有包含节气的日期
```

## 4. 实现方案

### 4.1 新引擎设计：反向查询引擎

创建 `ReverseQueryEngine` 类，负责反向查询的核心逻辑：

```typescript
class ReverseQueryEngine {
  // 农历日期反向查询
  queryLunarDate(lunarDate: string, yearRange: number[]): DateInfo[]
  
  // 节日名称反向查询
  queryFestival(festivalName: string, yearRange: number[]): DateInfo[]
  
  // 节气名称反向查询
  querySolarTerm(termName: string, yearRange: number[]): DateInfo[]
  
  // 日期范围条件查询
  queryByDateRange(startDate: string, endDate: string, type: string): DateInfo[]
  
  // 判断是否为休息日
  isRestDay(dateInfo: DateInfo): boolean
  
  // 判断是否为工作日
  isWorkDay(dateInfo: DateInfo): boolean
}
```

### 4.2 现有引擎扩展

#### 扩展 DateInfoEngine

添加反向查询支持方法：

```typescript
class DateInfoEngine {
  // 获取指定年份范围内的所有农历日期对应的公历日期
  getLunarDatesInRange(lunarDate: string, startYear: number, endYear: number): DateInfo[]
  
  // 获取指定年份范围内的所有节日日期
  getFestivalDatesInRange(festivalName: string, startYear: number, endYear: number): DateInfo[]
  
  // 获取指定年份范围内的所有节气日期
  getSolarTermDatesInRange(termName: string, startYear: number, endYear: number): DateInfo[]
}
```

#### 扩展 LunarEngine

添加农历解析和反向转换方法：

```typescript
class LunarEngine {
  // 解析农历日期字符串
  parseLunarDateString(lunarDateStr: string): { year: number, month: number, day: number, isLeap: boolean }
  
  // 查找指定农历日期在指定年份的所有公历对应日期
  findSolarDatesForLunar(lunarYear: number, lunarMonth: number, lunarDay: number, targetYear: number): string[]
}
```

### 4.3 性能优化考虑

1. **缓存机制**: 对频繁查询的节日、节气信息进行缓存
2. **批量查询**: 支持批量日期查询，减少重复计算
3. **索引优化**: 在内存中建立快速索引，加速反向查找
4. **范围限制**: 限制查询范围，避免过大的时间跨度

## 5. 测试策略

### 5.1 边界条件测试

- 农历闰月边界测试
- 跨年春节测试
- 节气边界日期测试
- 极早年份和极晚年份测试

### 5.2 性能测试

- 大范围年份查询性能
- 高频查询响应时间
- 内存使用监控

### 5.3 准确性验证

- 与权威农历数据对比验证
- 节日日期准确性验证
- 节气时间精确性验证

## 6. 错误处理

### 6.1 输入错误

- 格式错误的日期字符串
- 不支持的查询类型
- 超出范围的参数

### 6.2 业务错误

- 不存在的农历日期
- 不支持的节日名称
- 不存在的节气名称

### 6.3 系统错误

- 计算异常
- 内存不足
- 超时处理

## 7. 与现有系统兼容性

- 保持与现有接口一致的返回格式
- 复用现有的验证和错误处理机制
- 遵循现有的代码规范和架构设计
- 保持相同级别的测试覆盖率要求