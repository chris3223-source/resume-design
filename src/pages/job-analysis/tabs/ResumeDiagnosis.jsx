import React from "react";

import { ReportPage } from "../ReportPage.jsx";
import { resumeDiagnosis } from "../../../mocks/job-analysis.js";
export function ResumeDiagnosis() {
  return (
    <ReportPage>
      <div className="job-diagnosis-score-layout">
        <section className="job-report-panel job-diagnosis-total">
          <strong>{resumeDiagnosis.score}</strong>
          <span>匹配度</span>
        </section>
        <section className="job-report-panel job-diagnosis-dimensions">
          <h2>维度评分</h2>
          {resumeDiagnosis.dimensions.map(([label, score, detail]) => (
            <div className="job-diagnosis-dimension" key={label}>
              <div className="job-diagnosis-dimension-heading">
                <strong>{label}</strong>
                <span>{score}</span>
              </div>
              <div className="job-diagnosis-score-track" aria-hidden="true">
                <span style={{ width: `${score}%` }} />
              </div>
              <p>{detail}</p>
            </div>
          ))}
        </section>
      </div>
      <div className="job-diagnosis-lists">
        <section className="job-report-panel">
          <h2>主要问题</h2>
          <ul>
            {resumeDiagnosis.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </section>
        <section className="job-report-panel">
          <h2>优先修改建议</h2>
          <ul>
            {resumeDiagnosis.suggestions.map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        </section>
      </div>
    </ReportPage>
  );
}
