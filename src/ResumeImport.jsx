import React, { useState } from "react";
import { App, Button, Input, Tabs, Upload } from "antd";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";

export function ResumeImport() {
  const { message } = App.useApp();
  const [mode, setMode] = useState("file");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const ready = mode === "file" ? !!file : !!text.trim();
  function chooseFile(next) {
    if (!/\.(pdf|doc|docx)$/i.test(next.name)) {
      message.warning("请选择 PDF 或 Word 文件");
      return Upload.LIST_IGNORE;
    }
    if (next.size > 10 * 1024 * 1024) {
      message.warning("文件不能超过 10MB");
      return Upload.LIST_IGNORE;
    }
    setFile(next);
    return false;
  }
  return (
    <div className="resume-import">
      <Tabs
        activeKey={mode}
        onChange={setMode}
        items={[
          {
            key: "file",
            label: (
              <span>
                <UploadOutlined /> 文件上传
              </span>
            ),
            children: (
              <Upload.Dragger
                accept=".pdf,.doc,.docx"
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
                    : "支持 PDF、Word 格式，文件不超过 10MB"}
                </p>
              </Upload.Dragger>
            ),
          },
          {
            key: "text",
            label: (
              <span>
                <FileTextOutlined /> 文本粘贴
              </span>
            ),
            children: (
              <Input.TextArea
                aria-label="简历文本"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={30000}
                placeholder="请将简历文本粘贴到此处，支持多种简历格式。正式接入后可识别个人信息、工作经历、教育背景等内容。"
              />
            ),
          },
        ]}
      />
      <Button
        block
        type="primary"
        disabled={!ready}
        onClick={() =>
          message.info(
            `原型演示：${mode === "file" ? "文件已选择" : "文本已填写"}，未上传或解析，尚未创建简历。`,
          )
        }
      >
        导入简历
      </Button>
      <p className="import-demo-note">
        交互原型 · 文件与文本仅在本地展示，未连接解析服务
      </p>
    </div>
  );
}
