import React, { useState } from "react";
import { Button, Input, Select, Tag } from "antd";
import {
  ClockCircleOutlined,
  LineChartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  AudioOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "../../components/icons.js";
import {
  filterInterviewRecords,
  formatPracticeTime,
  summarizeInterviewRecords,
} from "./interviewRecords.js";
import "./interview-library.css";

export function InterviewLibrary({
  records,
  onStart,
  onReview,
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [kind, setKind] = useState("all");
  const summary = summarizeInterviewRecords(records);
  const filtered = filterInterviewRecords(records, query, status, kind);
  const constrained = !!query.trim() || status !== "all" || kind !== "all";
  function clearFilters() {
    setQuery("");
    setStatus("all");
    setKind("all");
  }
  return (
    <div className="interview-library-scroll">
      <div className="interview-library-inner">
        <header className="interview-library-heading">
          <Button type="primary" icon={<PlusOutlined />} onClick={onStart}>
            开始新面试
          </Button>
        </header>
        <section className="interview-library-stats" aria-label="面试统计">
          {[
            [<FileTextOutlined key="count" />, "累计面试", summary.count],
            [
              <LineChartOutlined key="average" />,
              "平均得分",
              summary.average ?? "—",
            ],
            [
              <ClockCircleOutlined key="time" />,
              "累计练习",
              formatPracticeTime(summary.seconds),
            ],
          ].map(([icon, label, value]) => (
            <article key={label}>
              <span className="interview-stat-icon">{icon}</span>
              <div>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            </article>
          ))}
        </section>
        <section
          className="interview-library-filters"
          aria-label="筛选面试记录"
        >
          <Input
            aria-label="搜索岗位或公司"
            placeholder="搜索岗位或公司"
            prefix={<SearchOutlined />}
            allowClear
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div>
            <Select
              aria-label="按状态筛选"
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "全部状态" },
                { value: "ended", label: "已结束" },
                { value: "abandoned", label: "已放弃" },
              ]}
            />
            <Select
              aria-label="按类型筛选"
              value={kind}
              onChange={setKind}
              options={[
                { value: "all", label: "全部类型" },
                ...["综合面", "专业能力面", "HR 面试"].map((value) => ({
                  value,
                  label: value,
                })),
              ]}
            />
          </div>
        </section>
        {!filtered.length ? (
          <section
            className="interview-library-empty"
            aria-label="面试记录空状态"
          >
            <span className="interview-empty-icon">
              <AudioOutlined />
            </span>
            <h2>{constrained ? "没有符合条件的面试记录" : "还没有面试记录"}</h2>
            <p>
              {constrained
                ? "试试其他关键词，或调整筛选条件"
                : "与 AI 面试官实战演练，并在这里追踪你的进步"}
            </p>
            {constrained ? (
              <Button onClick={clearFilters}>清除筛选</Button>
            ) : (
              <Button icon={<PlusOutlined />} onClick={onStart}>
                开始第一场面试
              </Button>
            )}
          </section>
        ) : (
          <section className="interview-library-records" aria-label="面试记录">
            {filtered.map((record) => (
              <article className="interview-record" key={record.id}>
                <span className="interview-record-icon">
                  <AudioOutlined />
                </span>
                <div>
                  <h2>
                    {record.job}
                    <Tag>
                      {record.status === "abandoned" ? "已放弃" : "已结束"}
                    </Tag>
                    <Tag>演示记录</Tag>
                  </h2>
                  <p>
                    {record.company ? `${record.company} · ` : ""}
                    {record.kind} ·{" "}
                    {record.mode === "voice" ? "语音演示" : "文字练习"} ·{" "}
                    {formatPracticeTime(record.elapsed)}
                  </p>
                  <small>
                    {record.createdAt} · {record.resume?.title || "简历练习"}
                  </small>
                </div>
                <Button onClick={() => onReview(record)}>查看复盘</Button>
              </article>
            ))}
          </section>
        )}
        <p className="interview-library-note">
          原型演示 · 记录仅在本次会话保留，刷新后重置；未连接真实面试或评分服务
        </p>
      </div>
    </div>
  );
}
