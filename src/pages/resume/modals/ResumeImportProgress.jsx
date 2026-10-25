import React from "react";
import { Alert, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { CheckOutlined, CloseOutlined } from "../../../components/icons.js";
import { resumeImportSteps } from "../../../mocks/resume-import.js";

export function ResumeImportProgress({ task, onClose, onRetry, onEdit }) {
  const succeeded = task.status === "succeeded";
  const failed = task.status === "failed";
  return (
    <div className="import-progress">
      <div
        className={`import-progress-summary ${failed ? "is-failed" : ""}`}
        role="status"
        aria-live="polite"
      >
        <span className="import-progress-symbol">
          {succeeded ? (
            <CheckOutlined />
          ) : failed ? (
            <CloseOutlined />
          ) : (
            <LoadingOutlined />
          )}
        </span>
        <div>
          <h3>
            {succeeded
              ? "导入演示完成"
              : failed
                ? "这次整理未能完成"
                : "正在为你整理简历"}
          </h3>
          <p>
            {succeeded
              ? "空白演示简历已加入列表，可以继续编辑。"
              : failed
                ? "请检查输入内容，再重新导入。"
                : "将简历内容整理成清晰、易编辑的结构。"}
          </p>
        </div>
      </div>
      {failed && (
        <Alert
          type="error"
          showIcon
          message="演示失败：经历内容整理未完成，未创建演示简历。"
        />
      )}
      {task.pollError && (
        <Alert
          type="warning"
          showIcon
          role="status"
          message="演示异常：暂时无法获取最新进度，正在重试。"
        />
      )}
      <ol className="import-progress-steps" aria-label="导入整理进度">
        {resumeImportSteps.map((label, index) => {
          const complete = succeeded || index < task.step;
          const current = !succeeded && !failed && index === task.step;
          const failedHere = failed && index === task.step;
          const state = complete
            ? "complete"
            : current
              ? "current"
              : failedHere
                ? "failed"
                : "waiting";
          return (
            <li
              key={label}
              className={`is-${state}`}
              aria-current={current ? "step" : undefined}
            >
              <span className="import-step-icon">
                {complete ? (
                  <CheckOutlined />
                ) : current ? (
                  <LoadingOutlined />
                ) : failedHere ? (
                  <CloseOutlined />
                ) : (
                  index + 1
                )}
              </span>
              <span>{label}</span>
              <small>
                {complete
                  ? "已完成"
                  : current
                    ? "处理中"
                    : failedHere
                      ? "未完成"
                      : "待处理"}
              </small>
            </li>
          );
        })}
      </ol>
      <p className="import-demo-note">
        原型演示 · 未上传、未解析、未调用 AI；仅演示空白简历，刷新后重置
      </p>
      <div className="import-progress-actions">
        <Button onClick={onClose}>关闭</Button>
        {succeeded && (
          <Button type="primary" onClick={() => onEdit(task.doc)}>
            立即编辑
          </Button>
        )}
        {failed && (
          <Button type="primary" onClick={onRetry}>
            重新导入
          </Button>
        )}
      </div>
    </div>
  );
}
