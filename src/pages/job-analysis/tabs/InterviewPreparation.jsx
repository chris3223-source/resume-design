import React from "react";

import { interviewPreparation } from "../../../mocks/interview-preparation.js";

import { ReportPage } from "../ReportPage.jsx";

export function InterviewPreparation() {
  return (
    <ReportPage>
      <section className="job-interview-intro">
        <h2>自我介绍</h2>
        <p>{interviewPreparation.introduction}</p>
      </section>
      <div className="job-interview-questions">
        <h2>可能追问（{interviewPreparation.questions.length} 题）</h2>
        {interviewPreparation.questions.map(
          ({ question, answer, evidence }, index) => (
            <article key={question}>
              <span>Q{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{question}</strong>
                <p>
                  <b>建议回答：</b>
                  {answer}
                </p>
                <p>
                  <b>回答依据：</b>
                  {evidence}
                </p>
              </div>
            </article>
          ),
        )}
      </div>
      <div className="job-interview-supporting">
        <section className="job-report-panel">
          <h2>需要准备的证据</h2>
          <ul>
            {interviewPreparation.evidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="job-report-panel">
          <h2>可能夸大的表达</h2>
          <ul>
            {interviewPreparation.exaggerations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="job-report-panel">
          <h2>建议补充的数据</h2>
          <ul>
            {interviewPreparation.suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </ReportPage>
  );
}
