import React from "react";
import { Avatar, Form, Input } from "antd";
import { UserOutlined } from "../../components/icons.js";

import "./resume-editor.css";

import { example } from "../../mocks/resumes.js";
export function resumeFields(doc) {
  return (
    doc?.data ||
    (doc?.blank
      ? Object.fromEntries(Object.keys(example).map((key) => [key, ""]))
      : example)
  );
}
function Lines({ text }) {
  return (
    <ul>
      {text
        .split("\n")
        .filter((line) => line.trim())
        .map((line, i) => (
          <li key={i}>{line}</li>
        ))}
    </ul>
  );
}
function Section({ title, children, className = "" }) {
  return (
    <section className={`resume-section ${className}`}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
export function ResumeDocument({ doc }) {
  const d = resumeFields(doc);
  return (
    <>
      <header className="resume-heading">
        <div>
          <h1>{d.name || "你的姓名"}</h1>
          {d.job && <p>求职意向：{d.job}</p>}
          <div className="contact">
            {[d.phone, d.email, d.city].filter(Boolean).join(" · ")}
          </div>
        </div>
        <Avatar shape="square" size={60} icon={<UserOutlined />} />
      </header>
      {!Object.values(d).some(Boolean) && (
        <p className="muted">空白简历 · 点击手动编辑，开始填写你的经历。</p>
      )}
      {d.summary && (
        <Section title="个人简介" className="resume-section-summary">
          <p>{d.summary}</p>
        </Section>
      )}
      {(d.school || d.major) && (
        <Section title="教育经历" className="resume-section-education">
          <div className="resume-row">
            <strong>{d.school}</strong>
            <span>{d.educationDates}</span>
          </div>
          <p>{d.major}</p>
          <p>{d.educationDescription}</p>
        </Section>
      )}
      {(d.projectName || d.secondName) && (
        <Section title="项目经历" className="resume-section-projects">
          {d.projectName && (
            <>
              <div className="resume-row">
                <strong>{d.projectName}</strong>
                <span>{d.projectDates}</span>
              </div>
              <p className="tech">{d.projectTech}</p>
              <p>{d.projectDescription}</p>
              <Lines text={d.projectBullets} />
            </>
          )}
          {d.secondName && (
            <>
              <div className="resume-row second-project">
                <strong>{d.secondName}</strong>
                <span>{d.secondDates}</span>
              </div>
              <p className="tech">{d.secondTech}</p>
              <Lines text={d.secondBullets} />
            </>
          )}
        </Section>
      )}
      {d.skills && (
        <Section title="专业技能" className="resume-section-skills">
          <Lines text={d.skills} />
        </Section>
      )}
      {d.extra && (
        <Section title="补充信息" className="resume-section-extra">
          <p>{d.extra}</p>
        </Section>
      )}
      <div className="paper-demo">本地交互原型 · 内容仅在本次会话保留</div>
    </>
  );
}
export function ResumeEditor({ doc, onChange }) {
  const data = resumeFields(doc);
  function field(key, label, rows) {
    return (
      <Form.Item
        key={key}
        label={label}
        htmlFor={`edit-${key}`}
        className={rows ? "editor-wide" : ""}
      >
        {rows ? (
          <Input.TextArea
            id={`edit-${key}`}
            rows={rows}
            value={data[key]}
            onChange={(e) => onChange(doc, { ...data, [key]: e.target.value })}
          />
        ) : (
          <Input
            id={`edit-${key}`}
            value={data[key]}
            onChange={(e) => onChange(doc, { ...data, [key]: e.target.value })}
          />
        )}
      </Form.Item>
    );
  }
  return (
    <div className="resume-editor-scroll">
      <Form layout="vertical" className="resume-editor-form">
        <section>
          <h2>
            <UserOutlined /> 基本信息
          </h2>
          <div className="editor-field-grid">
            {field("name", "姓名")}
            {field("job", "求职意向")}
            {field("phone", "电话")}
            {field("email", "邮箱")}
            {field("city", "城市")}
          </div>
        </section>
        <section>
          <h2>个人简介</h2>
          {field("summary", "简介内容", 5)}
        </section>
        <section>
          <h2>教育经历</h2>
          <div className="editor-field-grid">
            {field("school", "学校")}
            {field("major", "专业与学历")}
            {field("educationDates", "起止时间")}
            {field("educationDescription", "在校经历", 3)}
          </div>
        </section>
        <section>
          <h2>项目经历</h2>
          <div className="editor-field-grid">
            {field("projectName", "项目名称")}
            {field("projectDates", "起止时间")}
            {field("projectTech", "技术栈")}
            {field("projectDescription", "项目介绍", 3)}
            {field("projectBullets", "职责与成果（每行一条）", 5)}
          </div>
        </section>
        <section>
          <h2>项目经历 · 第二段</h2>
          <div className="editor-field-grid">
            {field("secondName", "项目名称")}
            {field("secondDates", "起止时间")}
            {field("secondTech", "技术栈")}
            {field("secondBullets", "职责与成果（每行一条）", 4)}
          </div>
        </section>
        <section>
          <h2>专业技能</h2>
          {field("skills", "技能说明（每行一条）", 4)}
        </section>
        <section>
          <h2>补充信息</h2>
          {field("extra", "补充内容", 3)}
        </section>
        <p className="editor-local-note">
          修改即时同步右侧预览 · 仅本次原型会话保留，刷新后重置
        </p>
      </Form>
    </div>
  );
}
