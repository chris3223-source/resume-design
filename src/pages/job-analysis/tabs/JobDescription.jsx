import React from "react";
import { Tag } from "antd";

import { ReportPage } from "../ReportPage.jsx";
import { formalJobDescription } from "../../../mocks/job-analysis.js";
export function JobDescription() {
  return (
    <ReportPage>
      <div className="job-jd-columns">
        <JobDescriptionList
          title="岗位职责"
          items={formalJobDescription.duties}
        />
        <JobDescriptionList
          title="硬性要求"
          items={formalJobDescription.hardRequirements}
        />
      </div>
      <div className="job-jd-columns">
        <JobDescriptionList
          title="隐性要求"
          items={formalJobDescription.implicitRequirements}
        />
        <section className="job-report-panel">
          <h2>理想候选人画像</h2>
          <p>{formalJobDescription.candidateProfile}</p>
        </section>
      </div>
      <section className="job-report-panel">
        <h2>关键词</h2>
        <div className="job-jd-keywords">
          {formalJobDescription.keywords.map((keyword) => (
            <Tag key={keyword}>{keyword}</Tag>
          ))}
        </div>
      </section>
      <section className="job-report-panel">
        <h2>核心能力表</h2>
        <div className="job-matching-table-wrap">
          <table className="job-matching-table">
            <thead>
              <tr>
                <th>能力</th>
                <th>重要性</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {formalJobDescription.competencies.map(
                ([ability, importance, description]) => (
                  <tr key={ability}>
                    <th>{ability}</th>
                    <td>{importance}</td>
                    <td>{description}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </ReportPage>
  );
}

function JobDescriptionList({ title, items }) {
  return (
    <section className="job-report-panel">
      <h2>{title}</h2>
      <ul className="job-jd-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
