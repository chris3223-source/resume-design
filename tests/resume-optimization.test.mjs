import test from "node:test";
import assert from "node:assert/strict";
import {
  resumeOptimizationStyles,
  resumeOptimizationRows,
  getResumeOptimizationRow,
} from "../src/resumeOptimization.js";

test("keeps the four demo optimization styles and six comparison modules", () => {
  assert.deepEqual(resumeOptimizationStyles, [
    "更简洁",
    "降低夸张",
    "更偏 AI 产品",
    "更偏 ToB SaaS",
  ]);
  assert.equal(resumeOptimizationRows.length, 6);
  assert.deepEqual(
    resumeOptimizationRows.map(({ module }) => module),
    [
      "职业摘要",
      "工作经历 - WMS",
      "工作经历 - 盘点",
      "项目经历 - 智能补货",
      "新增 - AI 实践项目",
      "技能工具",
    ],
  );
});

test("preserves the demo's exact AI practice project and risk wording", () => {
  const row = resumeOptimizationRows.find(
    ({ module }) => module === "新增 - AI 实践项目",
  );
  assert.deepEqual(row, {
    module: "新增 - AI 实践项目",
    before: "（简历中未体现）",
    after:
      "独立开发内部文档问答 Demo（LangChain + 向量检索 + GPT），支持产品文档语义搜索与问答，准确率达 85%，验证 RAG 方案在知识库场景的可行性",
    reason: "将补充信息中的 Demo 经验结构化写入，补齐 AI 经历缺口",
    risk: "明确标注为 Demo/个人项目，避免误导为商业落地",
  });
});

test("selects the requested optimization module and falls back to the first", () => {
  assert.equal(
    getResumeOptimizationRow("工作经历 - 盘点").module,
    "工作经历 - 盘点",
  );
  assert.equal(
    getResumeOptimizationRow("unknown module").module,
    "职业摘要",
  );
});
