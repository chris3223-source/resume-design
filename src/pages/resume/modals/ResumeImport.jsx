import React, { useState } from "react";
import { Alert, App, Button, Input, Select, Tabs, Upload } from "antd";
import { UploadOutlined, FileTextOutlined } from "../../../components/icons.js";
import { resumeImportScenarios } from "../../../mocks/resume-import.js";

export function ResumeImport({ busy, onSubmit, submitError }) {
  const { message } = App.useApp();
  const [mode, setMode] = useState("file");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("导入的简历");
  const [stage, setStage] = useState("应届生");
  const [scenario, setScenario] = useState("success");
  const ready = title.trim() && (mode === "file" ? !!file : !!text.trim());
  function chooseFile(next) {
    if (/\.doc$/i.test(next.name)) {
      message.warning("暂不支持旧版 DOC 文件，请转换为 DOCX、PDF 或 TXT");
      return Upload.LIST_IGNORE;
    }
    if (!/\.(pdf|docx|txt)$/i.test(next.name)) {
      message.warning("请选择 PDF、DOCX 或 TXT 文件");
      return Upload.LIST_IGNORE;
    }
    if (next.size > 10 * 1024 * 1024) {
      message.warning("文件不能超过 10MB");
      return Upload.LIST_IGNORE;
    }
    setFile(next);
    setTitle((current) =>
      current === "导入的简历" ? next.name.replace(/\.[^.]+$/, "") : current,
    );
    return false;
  }
  return (
    <div className="resume-import">
      <div className="import-source-details">
        <div>
          <label htmlFor="import-resume-title">简历名称</label>
          <Input
            id="import-resume-title"
            className="import-name-input"
            value={title}
            maxLength={40}
            disabled={busy}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="import-career-stage">职业阶段</label>
          <Select
            id="import-career-stage"
            aria-label="职业阶段"
            value={stage}
            disabled={busy}
            onChange={setStage}
            options={[
              { value: "应届生", label: "应届生" },
              { value: "资深", label: "资深经验" },
            ]}
          />
        </div>
      </div>
      <Tabs
        activeKey={mode}
        onChange={setMode}
        items={[
          {
            key: "file",
            disabled: busy,
            label: (
              <span>
                <UploadOutlined /> 文件上传
              </span>
            ),
            children: (
              <Upload.Dragger
                accept=".pdf,.docx,.txt"
                disabled={busy}
                maxCount={1}
                showUploadList={false}
                beforeUpload={chooseFile}
              >
                <div className="import-upload-symbol">
                  <UploadOutlined />
                </div>
                <strong>{file ? file.name : "点击或拖拽文件到此处上传"}</strong>
                <p>
                  {file
                    ? "点击可重新选择文件"
                    : "支持 PDF、DOCX、TXT 格式，文件不超过 10MB"}
                </p>
              </Upload.Dragger>
            ),
          },
          {
            key: "text",
            disabled: busy,
            label: (
              <span>
                <FileTextOutlined /> 文本粘贴
              </span>
            ),
            children: (
              <Input.TextArea
                aria-label="简历文本"
                value={text}
                disabled={busy}
                onChange={(e) => setText(e.target.value)}
                maxLength={30000}
                placeholder="请将简历文本粘贴到此处，支持多种简历格式。正式接入后可识别个人信息、工作经历、教育背景等内容。"
              />
            ),
          },
        ]}
      />
      <div className="import-demo-scenario">
        <label htmlFor="import-scenario">原型状态预览</label>
        <Select
          id="import-scenario"
          aria-label="原型状态预览"
          value={scenario}
          disabled={busy}
          onChange={setScenario}
          options={resumeImportScenarios}
        />
      </div>
      {submitError && (
        <Alert
          type="error"
          showIcon
          role="alert"
          message="演示提交失败：暂时无法提交导入任务。输入已保留，可以再次尝试。"
        />
      )}
      <Button
        block
        type="primary"
        disabled={!ready || busy}
        loading={busy}
        onClick={() => onSubmit({ title, stage, scenario })}
      >
        {busy ? "正在提交…" : "导入简历"}
      </Button>
      <p className="import-demo-note">
        原型演示 · 文件与文本仅在本地展示，未上传、未解析，不创建真实简历
      </p>
    </div>
  );
}
