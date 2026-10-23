import React, { useState } from "react";
import { Button, Form, Input, Modal, Select, Tabs, Tag } from "antd";
import {
  AimOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BulbOutlined,
  FileTextOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { resumeFields } from "./ResumeEditor.jsx";
import {
  filterMatchingRows,
  jobMatchRows,
  summarizeMatchingRows,
} from "./jobMatching.js";
import {
  getResumeOptimizationRow,
  resumeOptimizationRows,
  resumeOptimizationStyles,
} from "./resumeOptimization.js";
import { interviewPreparation } from "./interviewPreparation.js";

const reportTabs = [
  ["jd", "JD 解析"],
  ["diagnosis", "简历诊断"],
  ["matching", "匹配分析"],
  ["followup", "经历追问"],
  ["optimization", "简历优化"],
  ["interview", "面试准备"],
];

const formalJobDescription = {
  duties: [
    "负责 AI 功能的产品规划与迭代（智能问答、文档理解、工作流自动化）",
    "深入理解 B 端客户业务场景，将 AI 能力转化为可落地产品方案",
    "与算法、工程团队协作，推动 AI 功能从 POC 到规模化上线",
    "建立 AI 产品效果评估体系，数据驱动持续优化",
    "跟踪 AI 行业趋势，输出竞品分析与产品策略",
  ],
  hardRequirements: [
    "3年以上产品经理经验",
    "ToB SaaS 或企业服务产品经验",
    "优秀的需求分析与逻辑思维能力",
    "良好的跨部门沟通与项目管理能力",
    "本科及以上学历",
  ],
  implicitRequirements: [
    "具备将传统 B 端系统经验迁移到 AI 场景的能力",
    "理解 LLM 能力边界，能设计合理的 AI 产品交互",
    "有数据驱动决策习惯，能量化 AI 功能效果",
    "对 AI 行业有持续学习意愿与基本认知",
    "能在资源有限情况下推动 MVP 快速验证",
  ],
  keywords: [
    "AI 产品经理",
    "LLM",
    "ToB SaaS",
    "产品规划",
    "Prompt",
    "POC",
    "数据驱动",
    "ERP",
    "WMS",
    "智能问答",
    "工作流自动化",
    "效果评估",
  ],
  candidateProfile:
    "具备 3-5 年 ToB 产品经验，有 ERP/WMS/数据报表等系统落地背景，近期主动学习 AI 并有小范围实践，能将业务抽象能力与 AI 能力结合，推动智能化功能从验证到规模化。",
  competencies: [
    [
      "AI 产品规划",
      "高",
      "能将 LLM 能力映射到具体业务场景，设计可落地的 AI 功能路线图",
    ],
    [
      "ToB 需求分析",
      "高",
      "深入理解企业客户业务流程，将复杂需求抽象为产品方案",
    ],
    [
      "跨团队协作",
      "高",
      "协调算法、工程、实施团队，推动 AI 功能从 POC 到上线",
    ],
    ["数据驱动", "中", "建立 AI 效果评估指标，用数据验证产品决策"],
    ["行业认知", "中", "跟踪 AI 行业趋势，具备竞品分析与策略输出能力"],
    ["项目管理", "中", "在资源约束下管理版本迭代与交付节奏"],
  ],
};

const resumeDiagnosis = {
  score: 58,
  dimensions: [
    ["岗位匹配度", 52, "ToB 与数据产品背景契合，但 AI 相关经历描述不足"],
    ["经历表达", 55, "多为功能描述，缺少量化成果与业务影响"],
    ["关键词覆盖", 48, "缺少 LLM、Prompt、AI 效果评估等核心关键词"],
    ["结构完整性", 72, "模块齐全，但职业摘要未突出转型动机与 AI 学习"],
    ["差异化亮点", 50, "ERP/WMS/报表组合有价值，但未与 AI 岗位建立连接"],
  ],
  issues: [
    "简历整体定位偏传统 B 端 PM，未体现 AI 产品转型意图",
    "工作经历 bullet 缺少 AI/智能化相关表述，关键词匹配度低",
    "量化数据偏少，部分表述（如 major 版本）不够专业",
    "补充信息中的 Demo 经验未体现在正文中",
    "职业摘要未呼应目标 JD 的核心能力要求",
  ],
  suggestions: [
    "重写职业摘要：突出 ToB + 数据产品背景向 AI 产品转型的路径",
    "将 WMS 补货、报表平台经历与「数据驱动」「智能化」建立关联",
    "补充 AI 学习与实践（文档问答 Demo）作为独立项目或技能模块",
    "每条 bullet 采用「动作 + 方法 + 量化结果」结构重写",
    "增加与 JD 关键词对齐的能力标签（LLM 应用、Prompt 设计等）",
  ],
};

export function JobAnalysisForm({
  open,
  resumes,
  selectedResumeId,
  onCancel,
  onSubmit,
}) {
  return (
    <Modal
      title="新建岗位分析"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnHidden
      className="job-analysis-modal"
    >
      <p className="muted job-form-intro">
        选择一份简历并填写目标岗位信息，查看 JD 解析、简历诊断和后续准备建议。
      </p>
      <Form
        key={open ? selectedResumeId : "closed"}
        layout="vertical"
        initialValues={{ resumeId: selectedResumeId }}
        onFinish={onSubmit}
      >
        <Form.Item label="分析简历" name="resumeId" rules={[{ required: true }]}>
          <Select
            options={resumes.map((resume) => ({
              value: resume.id,
              label: resume.title,
            }))}
            optionRender={(option) => (
              <span className="job-resume-option">
                <FileTextOutlined /> {option.label}
              </span>
            )}
          />
        </Form.Item>
        <Form.Item
          label="目标岗位"
          name="role"
          rules={[{ required: true, message: "请输入目标岗位" }]}
        >
          <Input placeholder="例如：前端开发工程师" />
        </Form.Item>
        <Form.Item label="目标公司（选填）" name="company">
          <Input placeholder="输入公司名称" />
        </Form.Item>
        <Form.Item label="岗位描述 JD（选填）" name="jd">
          <Input.TextArea
            rows={5}
            placeholder="粘贴岗位职责与任职要求，便于演示 JD 解析结果"
          />
        </Form.Item>
        <div className="job-form-note">
          <span>六个报告页面</span>
          <span>
            JD 解析 · 简历诊断 · 匹配分析 · 经历追问 · 简历优化 · 面试准备
          </span>
        </div>
        <div className="job-form-actions">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
            生成演示报告
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export function JobAnalysisInlineForm({
  selectedResumeId,
  selectedResumeTitle,
  onCancel,
  onSubmit,
}) {
  return (
    <div className="job-chat-form">
      <div className="job-chat-form-heading">
        <AimOutlined />
        <div>
          <strong>新建岗位分析</strong>
          <span>当前简历：{selectedResumeTitle}</span>
        </div>
      </div>
      <Form
        layout="vertical"
        size="small"
        onFinish={(values) => onSubmit({ ...values, resumeId: selectedResumeId })}
      >
        <Form.Item
          label="目标岗位"
          name="role"
          rules={[{ required: true, message: "请输入目标岗位" }]}
        >
          <Input placeholder="例如：前端开发工程师" />
        </Form.Item>
        <Form.Item label="目标公司（选填）" name="company">
          <Input placeholder="输入公司名称" />
        </Form.Item>
        <Form.Item label="岗位描述 JD（选填）" name="jd">
          <Input.TextArea rows={3} placeholder="粘贴岗位职责与任职要求" />
        </Form.Item>
        <div className="job-chat-form-footer">
          <span>将整理 JD 解析、简历诊断、匹配分析与面试准备</span>
          <div className="job-chat-form-actions">
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
              生成分析
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export function JobAnalysisPage({
  analyses,
  selectedAnalysisId,
  onBack,
  onCreate,
  resumes,
}) {
  const [activeTab, setActiveTab] = useState("jd");
  const activeTabKey = reportTabs.some(([key]) => key === activeTab)
    ? activeTab
    : "jd";
  const selected = selectedAnalysisId
    ? analyses.find((item) => item.id === selectedAnalysisId)
    : null;
  const resume = resumes.find((item) => item.id === selected?.resumeId);
  const data = resume ? resumeFields(resume) : {};

  if (!selected) {
    return (
      <div className="job-analysis-empty-page">
        <div className="job-report-welcome-icon">
          <AimOutlined />
        </div>
        <h1>岗位匹配</h1>
        <p>
          选择简历并填写目标岗位，分析完成后可在这里查看 JD 解析、简历诊断和求职准备。
        </p>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          新建岗位分析
        </Button>
        <div className="job-report-workflow">
          {reportTabs.map(([key, label], index) => (
            <React.Fragment key={key}>
              {index > 0 && <span className="job-report-workflow-arrow">→</span>}
              <span>{label}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      key: "jd",
      label: "JD 解析",
      children: <JobDescription />,
    },
    {
      key: "diagnosis",
      label: "简历诊断",
      children: <ResumeDiagnosis analysis={selected} data={data} />,
    },
    {
      key: "matching",
      label: "匹配分析",
      children: <MatchingAnalysis />,
    },
    {
      key: "followup",
      label: "经历追问",
      children: <ExperienceFollowup analysis={selected} data={data} />,
    },
    {
      key: "optimization",
      label: "简历优化",
      children: <ResumeOptimization />,
    },
    {
      key: "interview",
      label: "面试准备",
      children: <InterviewPreparation analysis={selected} data={data} />,
    },
  ];

  return (
    <div className="job-analysis-workspace">
      {selected.status === "processing" && (
        <div className="job-workspace-processing">
          演示工作流处理中 · 未调用 AI 或岗位分析服务
          <span />
        </div>
      )}
      <Tabs
        className="job-report-tabs"
        activeKey={activeTabKey}
        onChange={setActiveTab}
        renderTabBar={(props, DefaultTabBar) => (
          <div className="job-report-navigation">
            <Button
              aria-label="返回岗位匹配"
              title="返回岗位匹配"
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                setActiveTab("jd");
                onBack?.();
              }}
            />
            <DefaultTabBar {...props} />
          </div>
        )}
        items={tabItems}
      />
    </div>
  );
}

function JobDescription() {
  return (
    <ReportPage>
      <div className="job-jd-columns">
        <JobDescriptionList title="岗位职责" items={formalJobDescription.duties} />
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

function ResumeDiagnosis() {
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
            {resumeDiagnosis.issues.map((issue) => <li key={issue}>{issue}</li>)}
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

function MatchingAnalysis() {
  const [filter, setFilter] = useState("all");
  const counts = summarizeMatchingRows(jobMatchRows);
  const rows = filterMatchingRows(jobMatchRows, filter);

  return (
    <ReportPage>
      <div className="job-match-page-heading">
        <div className="job-match-filters" role="group" aria-label="匹配结果筛选">
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
          const statusClass = row.status === "已覆盖" ? "covered" : "supplement";
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
                  <span className={`job-match-status ${statusClass} ${strengthClass}`}>
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
                <ArrowRightOutlined className="job-match-connector" aria-hidden="true" />
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

function ExperienceFollowup({ analysis, data }) {
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

function ResumeOptimization() {
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

function InterviewPreparation() {
  return (
    <ReportPage>
      <section className="job-interview-intro">
        <h2>自我介绍</h2>
        <p>{interviewPreparation.introduction}</p>
      </section>
      <div className="job-interview-questions">
        <h2>可能追问（{interviewPreparation.questions.length} 题）</h2>
        {interviewPreparation.questions.map(({ question, answer, evidence }, index) => (
          <article key={question}>
            <span>Q{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{question}</strong>
              <p><b>建议回答：</b>{answer}</p>
              <p><b>回答依据：</b>{evidence}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="job-interview-supporting">
        <section className="job-report-panel">
          <h2>需要准备的证据</h2>
          <ul>{interviewPreparation.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="job-report-panel">
          <h2>可能夸大的表达</h2>
          <ul>{interviewPreparation.exaggerations.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="job-report-panel">
          <h2>建议补充的数据</h2>
          <ul>{interviewPreparation.suggestions.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>
    </ReportPage>
  );
}

function ReportPage({ action, children }) {
  return (
    <div className="job-report-tab-page">
      {action && <div className="job-report-page-actions">{action}</div>}
      <div className="job-report-tab-content">{children}</div>
    </div>
  );
}

