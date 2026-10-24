import test from "node:test";
import assert from "node:assert/strict";
import { interviewPreparation } from "../src/mocks/interview-preparation.js";

test("keeps the demo introduction and all ten interview questions verbatim", () => {
  assert.equal(interviewPreparation.questions.length, 10);
  assert.equal(
    interviewPreparation.introduction,
    "您好，我是张明，有 3.5 年 ToB SaaS 产品经验，主导过 WMS 和经营数据报表平台。我在工作中设计了智能补货策略，近期系统学习 AI 并完成了文档问答 Demo。我希望将 B 端行业理解与 AI 产品能力结合，贵司的 AI 产品方向与我的经验高度契合，期待进一步交流。",
  );
  assert.equal(
    interviewPreparation.questions[0].question,
    "你为什么想从传统 B 端 PM 转型做 AI 产品经理？",
  );
  assert.equal(
    interviewPreparation.questions[9].question,
    "你对我们公司和这个岗位了解多少？",
  );
});

test("includes the three preparation lists from the demo", () => {
  assert.equal(interviewPreparation.evidence.length, 5);
  assert.equal(interviewPreparation.exaggerations.length, 4);
  assert.equal(interviewPreparation.suggestions.length, 4);
  assert.equal(
    interviewPreparation.evidence[0],
    "文档问答 Demo 的可演示环境或录屏",
  );
});
