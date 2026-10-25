import React, { useEffect, useState } from "react";

import { ResumeDocument } from "../../resume/ResumeEditor.jsx";

import { Button, ColorPicker, Popover, Select } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

import { EditOutlined, DownloadOutlined } from "../../../components/icons.js";
import { resumeTemplates } from "../../../mocks/resume-templates.js";

export function Resume({
  doc,
  onEdit,
  onTemplateChange,
  onOpenTemplatePicker,
  showToolbar = true,
}) {
  const [size, setSize] = useState("13"),
    [font, setFont] = useState("黑体"),
    [lineHeight, setLineHeight] = useState("1.3"),
    [margin, setMargin] = useState("28"),
    [accent, setAccent] = useState("#1e4aff"),
    [templateId, setTemplateId] = useState(doc.templateId || "blue"),
    [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const selectedTemplate =
    resumeTemplates.find((template) => template.id === templateId) ||
    resumeTemplates.find((template) => template.id === "blue");
  const templatePickerContent = (
    <div className="resume-template-picker">
      {resumeTemplates.map((template) => (
        <button
          key={template.id}
          type="button"
          className={`resume-template-option ${templateId === template.id ? "selected" : ""}`}
          aria-pressed={templateId === template.id}
          onClick={() => chooseTemplate(template)}
        >
          <span style={{ backgroundColor: template.accent }} />
          {template.name}
        </button>
      ))}
    </div>
  );

  useEffect(() => {
    const template =
      resumeTemplates.find((item) => item.id === doc.templateId) ||
      resumeTemplates.find((item) => item.id === "blue");
    setTemplateId(template.id);
    setAccent(doc.templateId ? template.accent : "#1e4aff");
  }, [doc.id, doc.templateId]);

  function chooseTemplate(template) {
    setTemplateId(template.id);
    setAccent(template.accent);
    onTemplateChange?.(doc, template.id);
    setTemplatePickerOpen(false);
  }

  return (
    <div className="resume-wrap">
      {showToolbar && (
        <div className="resume-toolbar">
        <div className="resume-toolbar-primary-actions">
          {onEdit && (
            <Button
              className="toolbar-edit-button"
              aria-label="手动编辑"
              title="手动编辑"
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={onEdit}
            >
              手动编辑
            </Button>
          )}
          {onOpenTemplatePicker ? (
            <Button
              className="toolbar-template-button"
              aria-label="更换模板"
              title="更换模板"
              type="text"
              size="small"
              icon={<AppstoreOutlined />}
              onClick={onOpenTemplatePicker}
            >
              更换模板
            </Button>
          ) : (
            <Popover
              title="更换模板"
              trigger="click"
              placement="bottomLeft"
              open={templatePickerOpen}
              onOpenChange={setTemplatePickerOpen}
              content={templatePickerContent}
            >
              <Button
                className="toolbar-template-button"
                aria-label="更换模板"
                title="更换模板"
                type="text"
                size="small"
                icon={<AppstoreOutlined />}
              >
                更换模板
              </Button>
            </Popover>
          )}
        </div>
        <div className="resume-toolbar-format-actions">
          <Select
            className="toolbar-font-select"
            aria-label="简历字体"
            value={font}
            onChange={setFont}
            options={["黑体", "宋体", "微软雅黑"].map((value) => ({ value }))}
            variant="borderless"
            size="small"
          />
          <Select
            className="toolbar-size-select"
            aria-label="简历字号"
            value={size}
            onChange={setSize}
            options={["12", "13", "14", "15"].map((value) => ({ value }))}
            variant="borderless"
            size="small"
          />
          <div className="toolbar-control toolbar-line-height">
            行高
            <Select
              aria-label="简历行高"
              value={lineHeight}
              onChange={setLineHeight}
              options={["1.3", "1.5", "1.8"].map((value) => ({ value }))}
              variant="borderless"
              size="small"
            />
          </div>
          <div className="toolbar-control toolbar-margin">
            边距
            <Select
              aria-label="简历边距"
              value={margin}
              onChange={setMargin}
              options={["24", "28", "32"].map((value) => ({
                value,
                label: `${value}px`,
              }))}
              variant="borderless"
              size="small"
            />
          </div>
          <ColorPicker
            aria-label="简历主题色"
            value={accent}
            onChange={(color) => setAccent(color.toHexString())}
            showText={false}
          />
        </div>
        <Button
          className="export-button"
          type="primary"
          size="small"
          icon={<DownloadOutlined />}
          onClick={() => window.print()}
        >
          导出
        </Button>
        </div>
      )}
      <div className="paper-scroll">
        <article
          className={`resume-paper resume-template-${templateId}`}
          data-layout={selectedTemplate.layout || "single"}
          data-header={selectedTemplate.header || "left"}
          data-divider={selectedTemplate.divider || "solid"}
          style={{
            "--resume-size": `${size}px`,
            "--resume-line-height": lineHeight,
            "--resume-margin": `${margin}px`,
            "--theme-primary": accent,
            fontFamily:
              font === "宋体" ? "SimSun, serif" : "Microsoft YaHei, sans-serif",
          }}
        >
          <ResumeDocument doc={doc} />
        </article>
        <div className="paper-caption">A4 简历预览 · 内容仅作原型演示</div>
      </div>
    </div>
  );
}
