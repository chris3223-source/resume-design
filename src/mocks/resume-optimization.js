// 原型演示数据：静态报告内容，非真实分析结果。
export const resumeOptimizationStyles = [
  "更简洁",
  "降低夸张",
  "更偏 AI 产品",
  "更偏 ToB SaaS",
];

export const resumeOptimizationRows = [
  {
    module: "职业摘要",
    before:
      "3.5年 B 端产品经理经验，主导 ERP 库存管理、WMS 仓储系统及经营数据报表平台的产品设计与迭代。擅长需求调研、流程梳理与跨部门协作，具备从 0 到 1 搭建数据产品的经验。",
    after:
      "3.5年 ToB SaaS 产品经理，深耕 ERP/WMS 及经营数据报表领域，服务 50+ 企业客户。具备从 0 到 1 搭建数据产品与智能化功能（智能补货策略）的完整经验，近期系统学习 LLM 应用与 Prompt 设计，独立完成内部文档问答 Demo，正将数据驱动的产品方法论延伸至 AI 产品场景。",
    reason: "按「更偏 AI 产品」方向重写，建立 B 端经验与 AI 转型的叙事连接",
    risk: "Demo 项目需确保可演示，避免过度包装为「正式产品经验」",
  },
  {
    module: "工作经历 - WMS",
    before: "负责 WMS 仓储管理系统核心模块，服务 50+ 企业客户",
    after:
      "负责 WMS 仓储管理系统核心模块（入库/出库/盘点/补货）产品规划与迭代，覆盖 50+ 企业客户的 SaaS 标准化交付",
    reason: "补充模块范围与 SaaS 交付属性，增强 ToB 画像",
    risk: "模块列表需与实际负责范围一致",
  },
  {
    module: "工作经历 - 盘点",
    before: "主导库存盘点功能重构，盘点效率提升 40%",
    after:
      "主导库存盘点流程重构（移动端扫码 + 差异自动核对），单次盘点耗时从 4h 降至 2.4h，效率提升 40%",
    reason: "增加方法论与具体数据，提升可信度",
    risk: "时间数据需可溯源，面试可能被追问",
  },
  {
    module: "项目经历 - 智能补货",
    before:
      "基于历史销售数据设计补货策略模型，推动补货建议功能上线，缺货率下降 25%",
    after:
      "设计基于历史销售与季节性波动的智能补货策略（规则引擎 + 安全库存模型），经 3 个月 A/B 验证后全量上线，缺货率从 12% 降至 9%",
    reason: "将「智能补货」与 AI/智能化叙事对齐，补充验证过程",
    risk: "规则引擎不等于 LLM，面试时需诚实说明技术方案",
  },
  {
    module: "新增 - AI 实践项目",
    before: "（简历中未体现）",
    after:
      "独立开发内部文档问答 Demo（LangChain + 向量检索 + GPT），支持产品文档语义搜索与问答，准确率达 85%，验证 RAG 方案在知识库场景的可行性",
    reason: "将补充信息中的 Demo 经验结构化写入，补齐 AI 经历缺口",
    risk: "明确标注为 Demo/个人项目，避免误导为商业落地",
  },
  {
    module: "技能工具",
    before: "Axure、Figma、SQL、Jira、Confluence、数据分析",
    after:
      "产品：Axure、Figma、Jira | 数据：SQL、BI 报表 | AI：Prompt Engineering、LangChain（RAG Demo）、LLM 应用基础",
    reason: "分类展示并加入 AI 技能，对齐 JD 关键词",
    risk: "AI 技能标注「基础/Demo 级」，避免夸大",
  },
];
