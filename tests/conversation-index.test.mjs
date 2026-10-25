import test from "node:test";
import assert from "node:assert/strict";
import {
  activeConversationTurn,
  conversationTurns,
  indexDotScale,
} from "../src/pages/agent/components/conversationTurns.js";

test("indexes user turns and includes subsequent assistant content in each preview", () => {
  const turns = conversationTurns([
    { key: "intro", role: "assistant", content: "开场" },
    { key: "u1", role: "user", content: "优化简历" },
    {
      key: "a1",
      role: "assistant",
      content: {
        props: { children: ["建议", { props: { children: "项目成果" } }] },
      },
    },
    { key: "form", role: "assistant", content: { props: {} } },
    { key: "u2", role: "user", content: "准备面试" },
  ]);
  assert.deepEqual(turns, [
    { key: "u1", question: "优化简历", reply: "建议 项目成果\n表单或报告内容" },
    { key: "u2", question: "准备面试", reply: "" },
  ]);
  assert.deepEqual(conversationTurns([]), []);
});

test("current turn follows scroll position and reaches the final turn at the bottom", () => {
  assert.equal(activeConversationTurn([100, 300, 600], 100), 0);
  assert.equal(activeConversationTurn([-300, -100, 200], 0), 1);
  assert.equal(activeConversationTurn([-300, -100, 200], 0, true), 2);
});

test("dot magnification tapers around the focused or current turn", () => {
  assert.deepEqual([0, 1, 2, 3, 4].map(indexDotScale), [2.5, 2, 1.5, 1.25, 1]);
});
