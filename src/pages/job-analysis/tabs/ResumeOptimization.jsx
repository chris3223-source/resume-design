import React, { useState } from "react";
import { Button } from "antd";

import {
  getResumeOptimizationRow,
  resumeOptimizationRows,
  resumeOptimizationStyles,
} from "../optimization.js";

import { ReportPage } from "../ReportPage.jsx";

export function ResumeOptimization() {
  const [activeStyle, setActiveStyle] = useState(resumeOptimizationStyles[0]);
  const [selectedModule, setSelectedModule] = useState(
    resumeOptimizationRows[0].module,
  );
  const selectedRow = getResumeOptimizationRow(selectedModule);
  return (
    <ReportPage>
      <section className="job-optimization-panel">
        <div className="job-optimization-toolbar">
          <span>优化风格：</span>
          <div className="job-optimization-styles">
            {resumeOptimizationStyles.map((style) => (
              <Button
                className={`job-optimization-style${activeStyle === style ? " is-active" : ""}`}
                key={style}
                size="small"
                type="default"
                aria-pressed={activeStyle === style}
                onClick={() => setActiveStyle(style)}
              >
                {style}
              </Button>
            ))}
          </div>
        </div>
        <div className="job-optimization-layout">
          <nav className="job-optimization-module-list" aria-label="优化模块">
            {resumeOptimizationRows.map(({ module }) => (
              <button
                aria-current={selectedModule === module ? "page" : undefined}
                className={`job-optimization-module${selectedModule === module ? " is-active" : ""}`}
                key={module}
                onClick={() => setSelectedModule(module)}
                type="button"
              >
                {module}
              </button>
            ))}
          </nav>
          <div className="job-optimization-detail">
            <div className="job-optimization-module-heading">
              <strong>模块：</strong>
              <span>{selectedRow.module}</span>
            </div>
            <div className="job-optimization-before-after">
              <article className="job-optimization-before">
                <h3>修改前</h3>
                <p>{selectedRow.before}</p>
              </article>
              <article className="job-optimization-after">
                <h3>修改后</h3>
                <p>{selectedRow.after}</p>
              </article>
            </div>
            <article className="job-optimization-reason">
              <h3>修改理由</h3>
              <p>{selectedRow.reason}</p>
            </article>
            <article className="job-optimization-risk">
              <h3>风险提示</h3>
              <p>{selectedRow.risk}</p>
            </article>
          </div>
        </div>
      </section>
    </ReportPage>
  );
}
