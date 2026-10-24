import React from "react";
import { Button } from "antd";
import { AimOutlined, ArrowRightOutlined } from "../../../components/icons.js";
export function JobAnalysisMessage({
  analysis,
  status,
  setSelectedJobAnalysisId,
  setPage,
  setFull,
}) {
  return (
    <div className="job-chat-result">
      <p>
        {status === "processing"
          ? "已创建岗位分析任务，正在整理演示报告…"
          : "岗位分析流程演示已完成，报告已整理好。"}
      </p>
      <div
        className={`job-chat-result-card ${status === "processing" ? "processing" : ""}`}
      >
        <div className="job-chat-result-icon">
          <AimOutlined />
        </div>
        <div>
          <strong>{analysis.role}</strong>
          <span>{analysis.company || analysis.resumeTitle}</span>
          <small>
            {status === "processing"
              ? "JD 解析 → 简历诊断 → 求职准备"
              : "JD 解析 · 简历诊断 · 经历追问 · 面试准备"}
          </small>
        </div>
        {status === "complete" && (
          <Button
            type="link"
            onClick={() => {
              setSelectedJobAnalysisId(analysis.id);
              setPage("jobs");
              setFull(false);
            }}
          >
            查看完整报告 <ArrowRightOutlined />
          </Button>
        )}
      </div>
      <small className="demo-note">
        {status === "processing"
          ? "演示流程处理中 · 未调用 AI 或岗位分析服务"
          : "演示流程 · 未调用 AI 或岗位分析服务"}
      </small>
    </div>
  );
}
