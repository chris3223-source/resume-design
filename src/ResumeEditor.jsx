import React from "react";
import { Avatar, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./resume-editor.css";

const example = {
  name: "林同学",
  job: "前端开发工程师",
  phone: "138-0000-0000",
  email: "lin@example.com",
  city: "杭州",
  summary:
    "计算机科学与技术专业，熟悉 React、TypeScript 及现代前端工程化。注重用户体验与代码质量，具备独立完成 Web 应用开发的能力。",
  school: "某某大学",
  major: "计算机科学与技术 · 本科",
  educationDates: "2022.09 — 2026.06",
  educationDescription: "主修课程：数据结构、计算机网络、操作系统、数据库原理",
  projectName: "AI 求职简历工作台",
  projectDates: "2025.09 — 至今",
  projectTech: "React / TypeScript / Ant Design / Node.js",
  projectDescription:
    "面向求职者的简历编辑与岗位匹配工具，支持在线编辑、实时预览及简历导出。",
  projectBullets:
    "负责简历编辑器与实时预览模块，设计可复用的表单与简历区块。\n实现对话与工作区联动，支持多标签切换和可调整的分栏布局。\n通过按需加载和组件拆分优化页面体验，持续关注可访问性。",
  secondName: "校园活动管理平台",
  secondDates: "2025.03 — 2025.06",
  secondTech: "Vue 3 / Vite / REST API",
  secondBullets:
    "完成活动列表、搜索筛选与活动详情页面，适配桌面及移动端。\n封装请求与异常提示，统一加载、空数据和服务不可用状态。",
  skills:
    "熟悉 HTML、CSS、JavaScript，能够使用 TypeScript 开发。\n熟悉 React Hooks、组件化设计与常见性能优化。\n掌握 Git 协作流程，了解 Node.js 与数据库基础。",
  extra: "英语 CET-6 · 持续学习，乐于沟通与协作",
};
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
function Section({ title, children }) {
  return (
    <section className="resume-section">
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
        <Section title="个人简介">
          <p>{d.summary}</p>
        </Section>
      )}
      {(d.school || d.major) && (
        <Section title="教育经历">
          <div className="resume-row">
            <strong>{d.school}</strong>
            <span>{d.educationDates}</span>
          </div>
          <p>{d.major}</p>
          <p>{d.educationDescription}</p>
        </Section>
      )}
      {(d.projectName || d.secondName) && (
        <Section title="项目经历">
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
        <Section title="专业技能">
          <Lines text={d.skills} />
        </Section>
      )}
      {d.extra && (
        <Section title="补充信息">
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
