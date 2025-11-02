import { Validator } from '../../../src/utils/validator.js';

describe('Validator', () => {
  describe('validateDateString', () => {
    it('应该验证有效的日期字符串', () => {
      const result = Validator.validateDateString('2025-01-01');
      expect(result.isValid).toBe(true);
    });

    it('应该拒绝无效的日期格式', () => {
      const result = Validator.validateDateString('invalid-date');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('日期格式无效');
    });

    it('应该拒绝空字符串', () => {
      const result = Validator.validateDateString('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('日期不能为空');
    });

    it('应该拒绝非字符串类型', () => {
      const result = Validator.validateDateString(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('日期必须是字符串类型');
    });

    it('应该拒绝无效的日期值', () => {
      const result = Validator.validateDateString('2025-13-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('月份必须在1-12之间');
    });
  });

  describe('validateDateRange', () => {
    it('应该验证有效的日期范围', () => {
      const result = Validator.validateDateRange('2025-01-01', '2025-01-31');
      expect(result.isValid).toBe(true);
    });

    it('应该拒绝开始日期晚于结束日期', () => {
      const result = Validator.validateDateRange('2025-01-31', '2025-01-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('开始日期不能晚于结束日期');
    });

    it('应该拒绝无效的开始日期', () => {
      const result = Validator.validateDateRange('invalid-date', '2025-01-31');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('开始日期错误');
    });

    it('应该拒绝无效的结束日期', () => {
      const result = Validator.validateDateRange('2025-01-01', 'invalid-date');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('结束日期错误');
    });
  });

  describe('validateYear', () => {
    it('应该验证有效的年份', () => {
      const result = Validator.validateYear(2025);
      expect(result.isValid).toBe(true);
    });

    it('应该拒绝非数字类型', () => {
      const result = Validator.validateYear('2025');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('年份必须是数字类型');
    });

    it('应该拒绝非整数', () => {
      const result = Validator.validateYear(2025.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('年份必须是整数');
    });

    it('应该拒绝过小的年份', () => {
      const result = Validator.validateYear(999);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('年份必须在1900-2100之间');
    });

    it('应该拒绝过大的年份', () => {
      const result = Validator.validateYear(3001);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('年份必须在1900-2100之间');
    });
  });

  describe('validateMonth', () => {
    it('应该验证有效的月份', () => {
      const result = Validator.validateMonth(6);
      expect(result.isValid).toBe(true);
    });

    it('应该拒绝非数字类型', () => {
      const result = Validator.validateMonth('6');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('月份必须是数字类型');
    });

    it('应该拒绝非整数', () => {
      const result = Validator.validateMonth(6.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('月份必须是整数');
    });

    it('应该拒绝过小的月份', () => {
      const result = Validator.validateMonth(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('月份必须在1-12之间');
    });

    it('应该拒绝过大的月份', () => {
      const result = Validator.validateMonth(13);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('月份必须在1-12之间');
    });
  });

  describe('validateLunarDateString', () => {
    it('应该验证有效的农历日期字符串', () => {
      const result = Validator.validateLunarDateString('农历2025年正月初一');
      expect(result.isValid).toBe(true);
    });

    it('应该拒绝非字符串类型', () => {
      const result = Validator.validateLunarDateString(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('农历日期必须是字符串类型');
    });

    it('应该拒绝空字符串', () => {
      const result = Validator.validateLunarDateString('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('农历日期不能为空');
    });

    it('应该拒绝无效的农历日期格式', () => {
      const result = Validator.validateLunarDateString('无效的农历日期');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('农历日期格式无效');
    });

    it('应该验证闰月农历日期', () => {
      const result = Validator.validateLunarDateString('农历2025年闰六月初一');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateFestivalName', () => {
    it('应该验证有效的节日名称', () => {
      const result = Validator.validateFestivalName('春节');
      expect(result.isValid).toBe(true);
    });

    it('应该拒绝非字符串类型', () => {
      const result = Validator.validateFestivalName(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('节日名称必须是字符串');
    });

    it('应该拒绝空字符串', () => {
      const result = Validator.validateFestivalName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('节日名称不能为空');
    });

    it('应该拒绝无效的节日名称', () => {
      const result = Validator.validateFestivalName('不存在的节日');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('不支持的节日名称');
    });

    it('应该验证所有有效的节日名称', () => {
      // 使用实际validator.ts中支持的节日列表
      const validFestivals = [
        '春节', '元宵节', '清明节', '端午节', '七夕节', '中秋节', '重阳节', '除夕',
        '元旦', '劳动节', '国庆节', '儿童节', '妇女节', '教师节', '情人节', '圣诞节', '万圣节', '感恩节',
      ];

      validFestivals.forEach(festival => {
        const result = Validator.validateFestivalName(festival);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('validateSolarTermName', () => {
    it('应该验证有效的节气名称', () => {
      const result = Validator.validateSolarTermName('立春');
      expect(result.isValid).toBe(true);
    });

    it('应该拒绝非字符串类型', () => {
      const result = Validator.validateSolarTermName(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('节气名称必须是字符串');
    });

    it('应该拒绝空字符串', () => {
      const result = Validator.validateSolarTermName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('节气名称不能为空');
    });

    it('应该拒绝无效的节气名称', () => {
      const result = Validator.validateSolarTermName('不存在的节气');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('不支持的节气名称');
    });

    it('应该验证所有有效的节气名称', () => {
      const validSolarTerms = [
        '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
        '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
        '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
        '立冬', '小雪', '大雪', '冬至', '小寒', '大寒',
      ];

      validSolarTerms.forEach(term => {
        const result = Validator.validateSolarTermName(term);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('validateToolArgs', () => {
    it('应该验证get_date_info工具参数', () => {
      const result = Validator.validateToolArgs('get_date_info', { date: '2025-01-01' });
      expect(result.isValid).toBe(true);
    });

    it('应该拒绝未知的工具名称', () => {
      const result = Validator.validateToolArgs('unknown_tool', {});
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('未知的工具');
    });

    describe('get_date_info参数验证', () => {
      it('应该拒绝缺少date参数', () => {
        const result = Validator.validateToolArgs('get_date_info', {});
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('缺少必需参数: date');
      });

      it('应该拒绝无效的date参数', () => {
        const result = Validator.validateToolArgs('get_date_info', { date: 'invalid-date' });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('日期格式无效');
      });
    });

    describe('get_date_range_info参数验证', () => {
      it('应该验证有效的参数', () => {
        const result = Validator.validateToolArgs('get_date_range_info', {
          startDate: '2025-01-01',
          endDate: '2025-01-31',
        });
        expect(result.isValid).toBe(true);
      });

      it('应该拒绝缺少startDate参数', () => {
        const result = Validator.validateToolArgs('get_date_range_info', {
          endDate: '2025-01-31',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('缺少必需参数: startDate');
      });

      it('应该拒绝缺少endDate参数', () => {
        const result = Validator.validateToolArgs('get_date_range_info', {
          startDate: '2025-01-01',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('缺少必需参数: endDate');
      });

      it('应该拒绝无效的日期范围', () => {
        const result = Validator.validateToolArgs('get_date_range_info', {
          startDate: '2025-01-31',
          endDate: '2025-01-01',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('开始日期不能晚于结束日期');
      });
    });

    describe('reverse_query_by_name参数验证', () => {
      it('应该验证有效的参数', () => {
        const result = Validator.validateToolArgs('reverse_query_by_name', {
          query: '春节',
          type: 'festival',
        });
        expect(result.isValid).toBe(true);
      });

      it('应该拒绝缺少query参数', () => {
        const result = Validator.validateToolArgs('reverse_query_by_name', {
          type: 'festival',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('缺少必需参数: query');
      });

      it('应该拒绝缺少type参数', () => {
        const result = Validator.validateToolArgs('reverse_query_by_name', {
          query: '春节',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('缺少必需参数: type');
      });

      it('应该拒绝无效的type参数', () => {
        const result = Validator.validateToolArgs('reverse_query_by_name', {
          query: '春节',
          type: 'invalid_type',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('查询类型必须是: lunar, festival, solar_term 之一');
      });

      it('应该验证可选的year参数', () => {
        const result = Validator.validateToolArgs('reverse_query_by_name', {
          query: '春节',
          type: 'festival',
          year: 2025,
        });
        expect(result.isValid).toBe(true);
      });

      it('应该拒绝无效的year参数', () => {
        const result = Validator.validateToolArgs('reverse_query_by_name', {
          query: '春节',
          type: 'festival',
          year: 'invalid',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('年份必须是数字类型');
      });
    });

    describe('query_by_date_range参数验证', () => {
      it('应该验证有效的参数', () => {
        const result = Validator.validateToolArgs('query_by_date_range', {
          startDate: '2025-01-01',
          endDate: '2025-01-31',
          type: 'festivals',
        });
        expect(result.isValid).toBe(true);
      });

      it('应该拒绝缺少startDate参数', () => {
        const result = Validator.validateToolArgs('query_by_date_range', {
          endDate: '2025-01-31',
          type: 'festivals',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('缺少必需参数: startDate');
      });

      it('应该拒绝缺少endDate参数', () => {
        const result = Validator.validateToolArgs('query_by_date_range', {
          startDate: '2025-01-01',
          type: 'festivals',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('缺少必需参数: endDate');
      });

      it('应该拒绝缺少type参数', () => {
        const result = Validator.validateToolArgs('query_by_date_range', {
          startDate: '2025-01-01',
          endDate: '2025-01-31',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('缺少必需参数: type');
      });

      it('应该拒绝无效的type参数', () => {
        const result = Validator.validateToolArgs('query_by_date_range', {
          startDate: '2025-01-01',
          endDate: '2025-01-31',
          type: 'invalid_type',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('查询类型必须是: rest_days, work_days, festivals, solar_terms 之一');
      });

      it('应该拒绝无效的日期范围', () => {
        const result = Validator.validateToolArgs('query_by_date_range', {
          startDate: '2025-01-31',
          endDate: '2025-01-01',
          type: 'festivals',
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('开始日期不能晚于结束日期');
      });
    });
  });

  // 边界条件和覆盖率测试
  describe('边界条件测试', () => {
    it('应该处理null值', () => {
      const result = Validator.validateDateString(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('日期必须是字符串类型');
    });

    it('应该处理undefined值', () => {
      const result = Validator.validateYear(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('年份必须是数字类型');
    });

    it('应该处理空对象', () => {
      const result = Validator.validateToolArgs('get_date_info', {});
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('缺少必需参数: date');
    });

    it('应该处理极端年份值', () => {
      const result1 = Validator.validateYear(Number.MIN_SAFE_INTEGER);
      expect(result1.isValid).toBe(false);
      expect(result1.error).toContain('年份必须在1900-2100之间');

      const result2 = Validator.validateYear(Number.MAX_SAFE_INTEGER);
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('年份必须在1900-2100之间');
    });

    it('应该处理特殊字符串', () => {
      const result = Validator.validateLunarDateString('农历2025年正月初一 ');
      expect(result.isValid).toBe(true);
    });

    it('应该处理部分匹配的节日名称', () => {
      const result = Validator.validateFestivalName('春');
      expect(result.isValid).toBe(true); // 因为'春节'包含'春'
    });

    // 新增：覆盖未覆盖的行
    it('应该拒绝年份边界值 - 第29行', () => {
      const result = Validator.validateDateString('1899-01-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('年份必须在1900-2100之间');
    });

    it('应该拒绝月份边界值 - 第37行', () => {
      const result = Validator.validateDateString('2025-00-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('月份必须在1-12之间');
    });

    it('应该拒绝日期边界值 - 第43行', () => {
      const result = Validator.validateDateString('2025-01-00');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('日期必须在1-31之间');
    });

    it('应该拒绝超过366天的日期范围 - 第82行', () => {
      const result = Validator.validateDateRange('2025-01-01', '2026-01-03');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('查询范围不能超过366天（一年）');
    });

    it('应该拒绝非对象类型的参数 - 第96行', () => {
      const result = Validator.validateToolArgs('get_date_info', 'invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('参数必须是对象类型');
    });

    it('应该验证reverse_query_by_name的可选年份参数 - 第201行', () => {
      const result = Validator.validateToolArgs('reverse_query_by_name', {
        query: '春节',
        type: 'festival',
        year: 1800, // 无效年份
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('年份必须在1900-2100之间');
    });

    // 新增：覆盖剩余的未覆盖行
    it('应该拒绝不存在的日期 - 第43行', () => {
      const result = Validator.validateDateString('2025-02-30'); // 2月没有30日
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('日期不存在，请检查年月日是否正确');
    });

    it('应该拒绝空的查询内容 - 第201行', () => {
      const result = Validator.validateToolArgs('reverse_query_by_name', {
        query: '   ', // 只有空格的字符串
        type: 'festival',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('查询内容必须是有效的字符串');
    });
  });

  // 覆盖率提升测试
  describe('覆盖率提升测试', () => {
    it('应该覆盖validateDateString的所有分支', () => {
      // 测试非字符串类型
      expect(Validator.validateDateString(123).isValid).toBe(false);
      
      // 测试空字符串
      expect(Validator.validateDateString('').isValid).toBe(false);
      
      // 测试无效日期格式
      expect(Validator.validateDateString('abc').isValid).toBe(false);
      
      // 测试有效日期
      expect(Validator.validateDateString('2025-01-01').isValid).toBe(true);
    });

    it('应该覆盖validateDateRange的所有分支', () => {
      // 测试开始日期无效
      expect(Validator.validateDateRange('invalid', '2025-01-01').isValid).toBe(false);
      
      // 测试结束日期无效
      expect(Validator.validateDateRange('2025-01-01', 'invalid').isValid).toBe(false);
      
      // 测试日期范围无效
      expect(Validator.validateDateRange('2025-01-02', '2025-01-01').isValid).toBe(false);
      
      // 测试有效范围
      expect(Validator.validateDateRange('2025-01-01', '2025-01-02').isValid).toBe(true);
    });

    it('应该覆盖validateYear的所有分支', () => {
      // 测试非数字类型
      expect(Validator.validateYear('2025').isValid).toBe(false);
      
      // 测试非整数
      expect(Validator.validateYear(2025.5).isValid).toBe(false);
      
      // 测试范围外的值
      expect(Validator.validateYear(999).isValid).toBe(false);
      expect(Validator.validateYear(3001).isValid).toBe(false);
      
      // 测试有效年份
      expect(Validator.validateYear(2025).isValid).toBe(true);
    });

    it('应该覆盖validateMonth的所有分支', () => {
      // 测试非数字类型
      expect(Validator.validateMonth('6').isValid).toBe(false);
      
      // 测试非整数
      expect(Validator.validateMonth(6.5).isValid).toBe(false);
      
      // 测试范围外的值
      expect(Validator.validateMonth(0).isValid).toBe(false);
      expect(Validator.validateMonth(13).isValid).toBe(false);
      
      // 测试有效月份
      expect(Validator.validateMonth(6).isValid).toBe(true);
    });

    it('应该覆盖validateLunarDateString的所有分支', () => {
      // 测试非字符串类型
      expect(Validator.validateLunarDateString(123).isValid).toBe(false);
      
      // 测试空字符串
      expect(Validator.validateLunarDateString('').isValid).toBe(false);
      expect(Validator.validateLunarDateString('   ').isValid).toBe(false);
      
      // 测试无效格式
      expect(Validator.validateLunarDateString('无效格式').isValid).toBe(false);
      
      // 测试有效格式
      expect(Validator.validateLunarDateString('农历2025年正月初一').isValid).toBe(true);
    });

    it('应该覆盖validateFestivalName的所有分支', () => {
      // 测试非字符串类型
      expect(Validator.validateFestivalName(123).isValid).toBe(false);
      
      // 测试空字符串
      expect(Validator.validateFestivalName('').isValid).toBe(false);
      expect(Validator.validateFestivalName('   ').isValid).toBe(false);
      
      // 测试不支持的节日
      expect(Validator.validateFestivalName('不存在的节日').isValid).toBe(false);
      
      // 测试有效节日
      expect(Validator.validateFestivalName('春节').isValid).toBe(true);
    });

    it('应该覆盖validateSolarTermName的所有分支', () => {
      // 测试非字符串类型
      expect(Validator.validateSolarTermName(123).isValid).toBe(false);
      
      // 测试空字符串
      expect(Validator.validateSolarTermName('').isValid).toBe(false);
      expect(Validator.validateSolarTermName('   ').isValid).toBe(false);
      
      // 测试不支持的节气
      expect(Validator.validateSolarTermName('不存在的节气').isValid).toBe(false);
      
      // 测试有效节气
      expect(Validator.validateSolarTermName('立春').isValid).toBe(true);
    });

    it('应该覆盖validateToolArgs的所有分支', () => {
      // 测试未知工具
      expect(Validator.validateToolArgs('unknown_tool', {}).isValid).toBe(false);
      
      // 测试各种工具的参数验证
      expect(Validator.validateToolArgs('get_date_info', { date: '2025-01-01' }).isValid).toBe(true);
      expect(Validator.validateToolArgs('get_date_range_info', { 
        startDate: '2025-01-01', 
        endDate: '2025-01-31',
      }).isValid).toBe(true);
      expect(Validator.validateToolArgs('reverse_query_by_name', { 
        query: '春节', 
        type: 'festival',
      }).isValid).toBe(true);
      expect(Validator.validateToolArgs('query_by_date_range', { 
        startDate: '2025-01-01', 
        endDate: '2025-01-31', 
        type: 'festivals',
      }).isValid).toBe(true);
    });
  });
});
