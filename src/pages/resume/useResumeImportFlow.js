import { useEffect, useRef, useState } from "react";
import { resumeImportSteps } from "../../mocks/resume-import.js";

// Deterministic prototype transitions; no file reads, requests or background service.
export function advanceImportDemo(task) {
  if (task.status === "submitting") {
    return {
      ...task,
      status: task.scenario === "submit-error" ? "submit-failed" : "running",
    };
  }
  if (task.status !== "running") return task;
  if (task.step === 2 && task.scenario === "failure") {
    return { ...task, status: "failed" };
  }
  if (
    task.step === 2 &&
    task.scenario === "progress-error" &&
    !task.progressRetried
  ) {
    return { ...task, pollError: true, progressRetried: true };
  }
  return task.step === resumeImportSteps.length - 1
    ? { ...task, status: "succeeded", pollError: false }
    : { ...task, step: task.step + 1, pollError: false };
}

export function useResumeImportFlow(onComplete) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState(null);
  const [closeConfirm, setCloseConfirm] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const completedId = useRef(null);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    if (!task || !["submitting", "running"].includes(task.status)) return;
    const timer = setTimeout(
      () => setTask(advanceImportDemo(task)),
      task.pollError ? 2400 : 1100,
    );
    return () => clearTimeout(timer);
  }, [task]);
  useEffect(() => {
    if (task?.status !== "succeeded" || completedId.current === task.doc.id)
      return;
    completedId.current = task.doc.id;
    onCompleteRef.current(task.doc);
  }, [task]);
  useEffect(() => {
    if (task && !["submitting", "running"].includes(task.status)) {
      setCloseConfirm(false);
    }
  }, [task]);
  const busy = task?.status === "submitting";
  const running = busy || task?.status === "running";
  return {
    open,
    task,
    closeConfirm,
    busy,
    show() {
      if (!running) setTask(null);
      setCloseConfirm(false);
      setOpen(true);
    },
    start({ title, stage, scenario }) {
      setTask({
        status: "submitting",
        step: 0,
        scenario,
        doc: {
          id: `import-demo-${Date.now()}`,
          title: `${title.trim()}（导入演示）`,
          stage,
          blank: true,
          date: new Date().toLocaleDateString("zh-CN"),
        },
      });
    },
    retry() {
      setTask(null);
    },
    requestClose() {
      if (running) setCloseConfirm(true);
      else setOpen(false);
    },
    cancelClose() {
      setCloseConfirm(false);
    },
    confirmClose() {
      setCloseConfirm(false);
      setOpen(false);
    },
  };
}
