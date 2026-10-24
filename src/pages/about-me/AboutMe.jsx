import { profileScoreParts as scoreParts } from "../../mocks/resumes.js";
import { ProfileFormContent } from "./modals/ProfileFormContent.jsx";
import React, { useState } from "react";
import { Avatar, Button, Form, Modal, Progress, Tag } from "antd";
import {
  BulbOutlined,
  CheckOutlined,
  StarOutlined,
} from "../../components/icons.js";
import {
  ArrowUpOutlined,
  ExperimentOutlined,
  ReadOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { resumeFields } from "../resume/ResumeEditor.jsx";
import "./about-me.css";

export function AboutMe({ doc, onChange, notify }) {
  const data = resumeFields(doc);
  const [editing, setEditing] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [form] = Form.useForm();
  const projects = [data.projectName, data.secondName].filter(Boolean);
  const skills = (data.projectTech || "React / TypeScript")
    .split("/")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  function editProfile() {
    form.setFieldsValue({
      name: data.name,
      job: data.job,
      summary: data.summary,
    });
    setEditing(true);
  }

  function saveProfile(values) {
    onChange?.(doc, {
      ...data,
      name: values.name,
      job: values.job,
      summary: values.summary,
    });
    setEditing(false);
    notify?.("个人画像已在本次原型中更新");
  }

  return (
    <div className="about-me-scroll">
      <div className="about-me-content">
        <section className="about-profile-card">
          <div className="about-profile-heading">
            <div className="about-profile-identity">
              <Avatar className="about-profile-avatar">
                {(data.name || "我").slice(0, 1)}
              </Avatar>
              <div>
                <h2>{data.name || "你的称呼"}</h2>
                <div className="about-profile-status">
                  <Tag>应届生</Tag>
                  <Tag color="green">求职准备中</Tag>
                </div>
              </div>
            </div>
          </div>
          <div className="about-profile-facts">
            {[
              data.major || "专业背景待补充",
              data.school || "教育经历待补充",
              `${projects.length} 段项目经历`,
            ].map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
          <div className="about-profile-intent">
            <small>求职意向</small>
            <strong>
              {data.job || "尚未填写目标岗位"} · {data.city || "城市待定"}
            </strong>
            <Button type="default" size="small" onClick={editProfile}>
              调整
            </Button>
          </div>
          <p className="about-profile-summary">
            {data.summary || "补充一段个人背景，让工作台更了解你的经历与目标。"}
          </p>
          <div className="about-traits">
            <div>
              <small>优势线索</small>
              <div>
                {skills.map((item) => (
                  <Tag color="green" key={item}>
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
            <div>
              <small>可完善方向</small>
              <div>
                <Tag color="gold">补充项目成果</Tag>
                <Tag color="gold">突出个人职责</Tag>
              </div>
            </div>
          </div>
        </section>

        <section className="about-score-card">
          <div className="about-score-overview">
            <div className="about-score-number">
              <strong>72</strong>
              <span>/ 100</span>
            </div>
            <div className="about-score-next">
              <small>演示分析 · 评分结构示意</small>
              <strong>
                <BulbOutlined /> 建议优先补充项目成果
              </strong>
            </div>
            <Button
              size="small"
              type="text"
              onClick={() => notify?.("该分析入口仅作交互演示")}
            >
              深入剖析自己 <RocketOutlined />
            </Button>
          </div>
          <div className="about-score-bar" aria-label="演示分数构成">
            {scoreParts.map((part) => (
              <i
                key={part.title}
                style={{ width: `${part.weight}%`, background: part.color }}
              />
            ))}
          </div>
          <div className="about-score-legend">
            {scoreParts.map((part) => (
              <span key={part.title}>
                <i style={{ background: part.color }} />
                {part.title} {Math.round((part.score * part.weight) / 100)}
              </span>
            ))}
          </div>
          <button
            className="about-breakdown-toggle"
            type="button"
            onClick={() => setShowBreakdown((value) => !value)}
          >
            {showBreakdown ? "收起分项" : "展开分项"}{" "}
            <span>{showBreakdown ? "⌃" : "⌄"}</span>
          </button>
          {showBreakdown && (
            <div className="about-score-parts">
              {scoreParts.map((part) => (
                <article className="about-score-part" key={part.title}>
                  <div className="about-score-part-heading">
                    <div
                      className="about-score-ring"
                      style={{
                        "--score-color": part.color,
                        "--score-value": `${part.score}%`,
                      }}
                    >
                      <strong>{part.score}</strong>
                    </div>
                    <div>
                      <strong>{part.title}</strong>
                      <small>
                        权重 {part.weight}% · 贡献{" "}
                        {Math.round((part.score * part.weight) / 100)}
                      </small>
                      <span>{part.text}</span>
                    </div>
                  </div>
                  <Progress
                    percent={part.score}
                    showInfo={false}
                    strokeColor={part.color}
                    trailColor="#edf0f5"
                    size="small"
                  />
                  <p>
                    {part.title === "教育背景"
                      ? `${data.school || "教育经历待补充"} · ${data.major || "专业信息待补充"}`
                      : part.title === "经历质量"
                        ? `${projects.join(" · ") || "项目经历待补充"}`
                        : part.title === "结构信号"
                          ? "把项目经历按职责、行动与结果讲清楚"
                          : "补充与目标岗位相关的技术实践"}
                  </p>
                </article>
              ))}
            </div>
          )}
          <div className="about-adjustment-card">
            <div>
              <strong>综合信号</strong>
              <small>演示建议 · 不代表真实评估</small>
            </div>
            <p>
              <StarOutlined />{" "}
              经历内容已覆盖项目与技能，可继续量化成果、突出个人贡献。
            </p>
            <div className="about-adjustment-tags">
              <Tag color="green">项目经验</Tag>
              <Tag color="green">技术技能</Tag>
              <Tag>成果可量化</Tag>
            </div>
          </div>
        </section>

        <section className="about-detail-card">
          <header>
            <ReadOutlined />
            <h3>教育经历</h3>
          </header>
          <div className="about-timeline-item">
            <i />
            <div>
              <strong>{data.school || "教育经历待补充"}</strong>
              <small>{data.educationDates || "时间待补充"}</small>
              <p>{data.major || "专业与学历待补充"}</p>
              <p>{data.educationDescription || "完善课程与教育背景描述。"}</p>
            </div>
          </div>
          <div className="about-insight">
            <CheckOutlined /> 教育信息可在简历中继续编辑，并同步到个人画像。
          </div>
        </section>

        <section className="about-detail-card">
          <header>
            <ExperimentOutlined />
            <h3>经历时间线</h3>
            <Button size="small" type="link" onClick={editProfile}>
              完善经历
            </Button>
          </header>
          {projects.length ? (
            projects.map((project, index) => (
              <div className="about-timeline-item" key={project}>
                <i />
                <div>
                  <strong>{project}</strong>
                  <small>
                    {index === 0 ? data.projectDates : data.secondDates}
                  </small>
                  <p>
                    {index === 0
                      ? data.projectDescription
                      : data.secondBullets?.split("\n")[0]}
                  </p>
                  <div>
                    {(index === 0 ? skills : ["项目协作", "问题解决"]).map(
                      (skill) => (
                        <Tag key={skill}>{skill}</Tag>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="about-empty">
              添加项目经历后，这里会展示你的职业时间线。
            </p>
          )}
        </section>

        <section className="about-detail-card">
          <header>
            <ArrowUpOutlined />
            <h3>求职方向</h3>
            <Button size="small" type="link" onClick={editProfile}>
              调整意向
            </Button>
          </header>
          <div className="about-direction-row">
            <div>
              <strong>{data.job || "目标岗位待补充"}</strong>
              <Tag color="green">目标方向</Tag>
            </div>
            <p>结合现有项目与技能，继续补充岗位相关成果和实践细节。</p>
          </div>
        </section>
        <p className="about-demo-note">
          内容基于当前原型简历展示 · 分数和建议均为演示示例
        </p>
      </div>

      <Modal
        title="调整个人画像"
        open={editing}
        onCancel={() => setEditing(false)}
        onOk={() => form.submit()}
        okText="保存信息"
        cancelText="取消"
      >
        <ProfileFormContent form={form} saveProfile={saveProfile} />
      </Modal>
    </div>
  );
}
