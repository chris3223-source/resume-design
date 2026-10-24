import React from "react";
import { Input } from "antd";

import { ReportPage } from "../ReportPage.jsx";

export function ExperienceFollowup({ analysis, data }) {
  const questions = [
    `在「${data.projectName || "这段项目经历"}」中，你具体负责哪些部分？`,
    `你为解决项目中的关键问题采取了什么行动？`,
    `有哪些可以核实的结果或反馈？如果没有量化数据，也可以描述前后变化。`,
    `这段经历与你应聘「${analysis.role}」最相关的能力是什么？`,
  ];
  return (
    <ReportPage>
      <div className="job-followup-list">
        {questions.map((question, index) => (
          <article key={question}>
            <div className="job-followup-question">
              <span>追问 {index + 1}</span>
              <strong>{question}</strong>
            </div>
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 5 }}
              placeholder="写下你的真实回答…"
            />
          </article>
        ))}
      </div>
    </ReportPage>
  );
}
