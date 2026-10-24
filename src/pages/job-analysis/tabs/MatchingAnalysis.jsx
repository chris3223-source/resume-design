import React, { useState } from "react";
import { Button } from "antd";
import {
  ArrowRightOutlined,
  BulbOutlined,
  FileTextOutlined,
  UserOutlined,
} from "../../../components/icons.js";

import {
  filterMatchingRows,
  jobMatchRows,
  summarizeMatchingRows,
} from "../matching.js";

import { ReportPage } from "../ReportPage.jsx";

export function MatchingAnalysis() {
  const [filter, setFilter] = useState("all");
  const counts = summarizeMatchingRows(jobMatchRows);
  const rows = filterMatchingRows(jobMatchRows, filter);

  return (
    <ReportPage>
      <div className="job-match-page-heading">
        <div
          className="job-match-filters"
          role="group"
          aria-label="匹配结果筛选"
        >
          <Button
            className={filter === "all" ? "is-active" : ""}
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            全部 <span>{counts.all}</span>
          </Button>
          <Button
            className={filter === "supplement" ? "is-active" : ""}
            aria-pressed={filter === "supplement"}
            onClick={() => setFilter("supplement")}
          >
            需补充 <span>{counts.supplement}</span>
          </Button>
          <Button
            className={filter === "covered" ? "is-active" : ""}
            aria-pressed={filter === "covered"}
            onClick={() => setFilter("covered")}
          >
            已覆盖 <span>{counts.covered}</span>
          </Button>
        </div>
      </div>
      <div className="job-match-cards">
        {rows.map((row) => {
          const statusClass =
            row.status === "已覆盖" ? "covered" : "supplement";
          const strengthClass =
            row.strength === "强"
              ? "strong"
              : row.strength === "中"
                ? "medium"
                : row.strength === "弱"
                  ? "weak"
                  : "none";
          const evidenceStatus =
            row.strength === "无"
              ? "无直接证据 · 需补充"
              : `证据${row.strength} · ${row.status}`;

          return (
            <article className="job-match-card" key={row.requirement}>
              <header className="job-match-card-header">
                <div className="job-match-card-title">
                  <h2>{row.requirement}</h2>
                  <span
                    className={`job-match-status ${statusClass} ${strengthClass}`}
                  >
                    {evidenceStatus}
                  </span>
                </div>
              </header>
              <div className="job-match-comparison">
                <section className="job-match-detail job-match-requirement">
                  <div className="job-match-detail-label">
                    <FileTextOutlined /> <strong>岗位需要</strong>
                  </div>
                  <p>{row.requirementDetail}</p>
                </section>
                <ArrowRightOutlined
                  className="job-match-connector"
                  aria-hidden="true"
                />
                <section className="job-match-detail job-match-evidence">
                  <div className="job-match-detail-label">
                    <UserOutlined /> <strong>你的证据</strong>
                  </div>
                  <p>{row.evidence}</p>
                </section>
              </div>
              <div className={`job-match-advice ${statusClass}`}>
                <BulbOutlined />
                <strong>优化建议</strong>
                <span>{row.advice}</span>
              </div>
            </article>
          );
        })}
      </div>
    </ReportPage>
  );
}
