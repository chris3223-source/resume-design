import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "../../../components/icons.js";
import { resumeTemplates } from "../../../mocks/resume-templates.js";
import { ResumeDocument } from "../../resume/ResumeEditor.jsx";

export function ResumeTemplatePicker({
  doc,
  selectedTemplateId,
  onSelect,
  onBack,
}) {
  return (
    <section className="agent-template-picker">
      <header className="agent-template-picker-header">
        <h2>选择模板</h2>
        <Button
          type="text"
          size="small"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
        >
          返回对话
        </Button>
      </header>
      <div className="agent-template-picker-list">
        {resumeTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            aria-pressed={selectedTemplateId === template.id}
            className={`agent-template-card ${selectedTemplateId === template.id ? "selected" : ""}`}
            onClick={() => onSelect(template.id)}
          >
            <span className="agent-template-thumbnail">
              <article
                className={`resume-paper resume-template-${template.id}`}
                data-layout={template.layout || "single"}
                data-header={template.header || "left"}
                data-divider={template.divider || "solid"}
                style={{
                  "--resume-size": "13px",
                  "--resume-line-height": 1.3,
                  "--resume-margin": "28px",
                  "--theme-primary": template.accent,
                }}
              >
                <ResumeDocument doc={doc} />
              </article>
            </span>
            <span className="agent-template-card-name">{template.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
