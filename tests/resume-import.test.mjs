import test from "node:test";
import assert from "node:assert/strict";
import { advanceImportDemo } from "../src/pages/resume/useResumeImportFlow.js";
import { resumeImportSteps } from "../src/mocks/resume-import.js";

const task = (scenario) => ({ status: "submitting", step: 0, scenario });

test("import demo visits all five steps before succeeding", () => {
  let current = advanceImportDemo(task("success"));
  for (let step = 0; step < resumeImportSteps.length; step += 1) {
    assert.equal(current.status, "running");
    assert.equal(current.step, step);
    current = advanceImportDemo(current);
  }
  assert.equal(current.status, "succeeded");
  assert.equal(advanceImportDemo(current), current);
});

test("failed import stops before creation", () => {
  let current = task("failure");
  for (let tick = 0; tick < 4; tick += 1) current = advanceImportDemo(current);
  assert.equal(current.status, "failed");
  assert.equal(current.step, 2);
  assert.equal(advanceImportDemo(current), current);
});

test("submission failure never enters processing", () => {
  const current = advanceImportDemo(task("submit-error"));
  assert.equal(current.status, "submit-failed");
  assert.equal(current.step, 0);
  assert.equal(advanceImportDemo(current), current);
});

test("progress interruption keeps its step then recovers", () => {
  let current = task("progress-error");
  for (let tick = 0; tick < 4; tick += 1) current = advanceImportDemo(current);
  assert.equal(current.status, "running");
  assert.equal(current.step, 2);
  assert.equal(current.pollError, true);
  current = advanceImportDemo(current);
  assert.equal(current.step, 3);
  assert.equal(current.pollError, false);
  current = advanceImportDemo(advanceImportDemo(current));
  assert.equal(current.status, "succeeded");
});
