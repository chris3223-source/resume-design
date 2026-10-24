import test from "node:test";
import assert from "node:assert/strict";
import {
  filterMatchingRows,
  jobMatchRows,
  summarizeMatchingRows,
} from "../src/pages/job-analysis/matching.js";

const rows = [
  { status: "已覆盖", requirement: "企业服务经验" },
  { status: "需补充", requirement: "AI 落地经验" },
  { status: "已覆盖", requirement: "项目管理" },
  { status: "需补充", requirement: "竞品分析" },
];

test("summarizes covered and supplement counts for matching filters", () => {
  assert.deepEqual(summarizeMatchingRows(rows), {
    all: 4,
    supplement: 2,
    covered: 2,
  });
});

test("filters matching rows while retaining their original order", () => {
  assert.deepEqual(
    filterMatchingRows(rows, "supplement").map((row) => row.requirement),
    ["AI 落地经验", "竞品分析"],
  );
  assert.deepEqual(
    filterMatchingRows(rows, "covered").map((row) => row.requirement),
    ["企业服务经验", "项目管理"],
  );
  assert.equal(filterMatchingRows(rows, "all").length, 4);
});

test("keeps the formal report's eight matches and prioritizes items to supplement", () => {
  assert.deepEqual(summarizeMatchingRows(jobMatchRows), {
    all: 8,
    supplement: 3,
    covered: 5,
  });
  assert.deepEqual(
    jobMatchRows.slice(0, 3).map((row) => row.status),
    ["需补充", "需补充", "需补充"],
  );
});
