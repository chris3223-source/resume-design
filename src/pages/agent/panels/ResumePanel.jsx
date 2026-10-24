import React, { useState } from "react";

import { ResumeDocument } from "../../resume/ResumeEditor.jsx";

import { Button, Select } from "antd";

import {
  EditOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from "../../../components/icons.js";

export function Resume({ doc, onEdit }) {
  const [size, setSize] = useState("13"),
    [font, setFont] = useState("黑体");

  return (
    <div className="resume-wrap">
      <div className="resume-toolbar">
        <FileTextOutlined />
        <span className="toolbar-divider" />
        <Select
          aria-label="简历字体"
          value={font}
          onChange={setFont}
          options={["黑体", "宋体", "微软雅黑"].map((value) => ({ value }))}
          variant="borderless"
          size="small"
        />
        <Select
          aria-label="简历字号"
          value={size}
          onChange={setSize}
          options={["12", "13", "14", "15"].map((value) => ({ value }))}
          variant="borderless"
          size="small"
        />
        <span className="line-label">行距 1.5</span>
        <span className="color-dot" />
        <Button
          className="export-button"
          size="small"
          icon={<DownloadOutlined />}
          onClick={() => window.print()}
        >
          打印 / 导出
        </Button>
      </div>
      <div className="paper-scroll">
        <article
          className="resume-paper"
          style={{
            "--resume-size": `${size}px`,
            fontFamily:
              font === "宋体" ? "SimSun, serif" : "Microsoft YaHei, sans-serif",
          }}
        >
          <ResumeDocument doc={doc} />
        </article>
        <div className="paper-caption">A4 简历预览 · 内容仅作原型演示</div>
      </div>
      {onEdit && (
        <Button
          className="resume-floating-edit"
          shape="round"
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          手动编辑
        </Button>
      )}
    </div>
  );
}
