import test from "node:test";
import assert from "node:assert/strict";
import {
  filterInterviewRecords,
  formatPracticeTime,
  summarizeInterviewRecords,
} from "../src/pages/interview/interviewRecords.js";

const records = [
  {
    id: "a",
    job: "前端开发工程师",
    company: "示例科技",
    kind: "综合面",
    status: "ended",
    elapsed: 60,
    score: null,
  },
  {
    id: "b",
    job: "产品经理",
    kind: "HR 面试",
    status: "abandoned",
    elapsed: 15,
    score: null,
  },
];
test("empty interview statistics stay at zero without fabricating an average score", () => {
  assert.deepEqual(summarizeInterviewRecords([]), {
    count: 0,
    seconds: 0,
    average: null,
  });
  assert.deepEqual(summarizeInterviewRecords(records), {
    count: 2,
    seconds: 75,
    average: null,
  });
  assert.equal(formatPracticeTime(0), "0 秒");
  assert.equal(formatPracticeTime(75), "1 分 15 秒");
});
test("interview search combines role/company, status and interview type", () => {
  assert.deepEqual(
    filterInterviewRecords(records, " 示例科技 ", "ended", "综合面"),
    [records[0]],
  );
  assert.deepEqual(
    filterInterviewRecords(records, "", "abandoned", "HR 面试"),
    [records[1]],
  );
  assert.deepEqual(filterInterviewRecords(records, "后端", "all", "all"), []);
  assert.deepEqual(
    filterInterviewRecords(records, "前端", "abandoned", "all"),
    [],
  );
});
