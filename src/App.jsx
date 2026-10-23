import React, { useState } from "react";
import { ResumeLibrary, exampleResumes } from "./ResumeLibrary.jsx";
import { ResumePreviewPage } from "./ResumePreviewPage.jsx";
import { ResumeEditor, ResumeDocument } from "./ResumeEditor.jsx";
import { Interview } from "./Interview.jsx";
import { AboutMe } from "./AboutMe.jsx";
import { AccountSettings, AuthPage } from "./Account.jsx";
import {
  JobAnalysisForm,
  JobAnalysisInlineForm,
  JobAnalysisPage,
} from "./JobAnalysis.jsx";
import {
  ConfigProvider,
  App as AntApp,
  Button,
  Dropdown,
  Avatar,
  Tag,
  Tabs,
  Form,
  Select,
  Radio,
  Splitter,
  Tooltip,
  Upload,
} from "antd";
import { Bubble, Sender, Conversations } from "@ant-design/x";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  EditOutlined,
  FileTextOutlined,
  AimOutlined,
  AudioOutlined,
  UserOutlined,
  PaperClipOutlined,
  CloseOutlined,
  ExpandOutlined,
  CompressOutlined,
  ArrowRightOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  DownloadOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const roles = {
  user: { placement: "end", variant: "filled", shape: "round" },
  assistant: {
    placement: "start",
    variant: "borderless",
    avatar: <Avatar className="ai-avatar" icon={<ThunderboltOutlined />} />,
  },
};
const initial = [
  {
    key: "u1",
    role: "user",
    content: "我想应聘前端开发工程师，帮我看看这份简历怎么优化。",
  },
  {
    key: "a1",
    role: "assistant",
    content: (
      <div>
        <p>
          好的，我会结合你的求职目标，从
          <strong>内容表达、项目亮点和岗位匹配</strong>三个方面帮你完善简历。
        </p>
        <p>已为你打开右侧简历。我们可以先从项目经历开始，让你的贡献更清晰。</p>
        <div className="suggestion">
          <BulbOutlined />
          <span>
            建议把「参与项目开发」改为「负责的模块 + 采取的行动 +
            可验证的结果」。
          </span>
        </div>
        <small className="demo-note">演示回复 · 未连接 AI 服务</small>
      </div>
    ),
  },
];
const labels = {
  resume: "前端开发工程师 · 简历",
  preferences: "求职偏好",
  profile: "关于我",
  jobs: "岗位匹配",
  interview: "面试准备",
};
function Resume({ doc, onEdit }) {
  const [size, setSize] = useState("13"),
    [font, setFont] = useState("黑体");

  return (
    <div className="resume-wrap">
      <div className="resume-toolbar">
        <FileTextOutlined />
        <span className="toolbar-divider" />
        <Select
          aria-label="简历字体"
          value={font}
          onChange={setFont}
          options={["黑体", "宋体", "微软雅黑"].map((value) => ({ value }))}
          variant="borderless"
          size="small"
        />
        <Select
          aria-label="简历字号"
          value={size}
          onChange={setSize}
          options={["12", "13", "14", "15"].map((value) => ({ value }))}
          variant="borderless"
          size="small"
        />
        <span className="line-label">行距 1.5</span>
        <span className="color-dot" />
        <Button
          className="export-button"
          size="small"
          icon={<DownloadOutlined />}
          onClick={() => window.print()}
        >
          打印 / 导出
        </Button>
      </div>
      <div className="paper-scroll">
        <article
          className="resume-paper"
          style={{
            "--resume-size": `${size}px`,
            fontFamily:
              font === "宋体" ? "SimSun, serif" : "Microsoft YaHei, sans-serif",
          }}
        >
          <ResumeDocument doc={doc} />
        </article>
        <div className="paper-caption">A4 简历预览 · 内容仅作原型演示</div>
      </div>
      {onEdit && (
        <Button
          className="resume-floating-edit"
          shape="round"
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          手动编辑
        </Button>
      )}
    </div>
  );
}
function Preferences({ notify }) {
  return (
    <div className="panel-scroll">
      <div className="form-card">
        <h3>
          <span />
          求职意向
        </h3>
        <Form
          layout="vertical"
          initialValues={{
            status: "应届毕业生",
            type: "校招",
            industry: "互联网 / IT",
            job: "前端开发工程师",
            city: "杭州",
            salary: "10–15K",
            company: "不限",
            arrival: "毕业后",
          }}
          onFinish={() => notify("求职偏好已在本次演示中保存，刷新后重置")}
        >
          <Form.Item label="当前求职状态" name="status" required>
            <Radio.Group
              optionType="button"
              options={["在校生", "应届毕业生", "在职看机会", "已离职"]}
            />
          </Form.Item>
          <Form.Item label="求职类型" name="type" required>
            <Radio.Group
              optionType="button"
              options={["实习", "校招", "社招"]}
            />
          </Form.Item>
          <div className="form-grid">
            {[
              [
                "industry",
                "意向行业",
                ["互联网 / IT", "金融", "制造业", "教育"],
              ],
              [
                "job",
                "意向职能",
                ["前端开发工程师", "后端开发工程师", "产品经理"],
              ],
              ["city", "意向城市", ["杭州", "上海", "北京", "深圳", "广州"]],
              ["salary", "期望薪资", ["不限", "10–15K", "15–20K", "20–30K"]],
            ].map(([name, label, options]) => (
              <Form.Item key={name} label={label} name={name} required>
                <Select options={options.map((value) => ({ value }))} />
              </Form.Item>
            ))}
          </div>
          <Form.Item label="公司类型" name="company">
            <Radio.Group
              optionType="button"
              options={["不限", "国企", "上市公司", "外企", "民企", "创业公司"]}
            />
          </Form.Item>
          <Form.Item label="到岗时间" name="arrival" required>
            <Radio.Group
              optionType="button"
              options={["随时到岗", "一个月内", "毕业后"]}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            保存偏好
          </Button>
        </Form>
      </div>
      <div className="form-card">
        <h3>
          <span />
          求职记忆
        </h3>
        <p className="muted">
          你主动提供的信息，可用于后续简历优化与面试准备。
        </p>
        <Tag>目标：前端开发</Tag>
        <Tag>应届毕业生</Tag>
        <p className="demo-note">演示数据 · 不会上传或持久保存</p>
      </div>
    </div>
  );
}
function Experience() {
  const { message } = AntApp.useApp();
  const [page, setPage] = useState("agent");
  const [editing, setEditing] = useState(false);
  const [resumeItems, setResumeItems] = useState(exampleResumes);
  const [selectedResume, setSelectedResume] = useState(exampleResumes[0]);
  const [resumeMenuOpen, setResumeMenuOpen] = useState(false);
  const currentResume =
    resumeItems.find((item) => item.id === selectedResume.id) || selectedResume;
  function editResume(doc) {
    setSelectedResume(doc);
    setEditing(true);
    setFull(false);
    setPage("agent");
    open("resume");
  }
  function updateResume(doc, data) {
    setResumeItems((items) =>
      items.map((item) =>
        item.id === doc.id ? { ...item, data, blank: false } : item,
      ),
    );
  }

  const [authMode, setAuthMode] = useState(null);
  const [account, setAccount] = useState({
    name: "林同学",
    phone: "",
    method: "演示体验",
  });
  const [sidebar, setSidebar] = useState(() => innerWidth > 1000),
    [panels, setPanels] = useState(["resume"]),
    [active, setActive] = useState("resume"),
    [full, setFull] = useState(false),
    [value, setValue] = useState(""),
    [session, setSession] = useState("1"),
    [files, setFiles] = useState([]);
  const [sessions, setSessions] = useState([
    { key: "1", label: "优化前端开发工程师简历" },
    { key: "2", label: "帮我从零创建一份简历" },
    { key: "3", label: "准备一场前端技术面试" },
  ]);
  const [histories, setHistories] = useState({ 1: initial, 2: [], 3: [] });
  const [jobAnalyses, setJobAnalyses] = useState([]);
  const [selectedJobAnalysisId, setSelectedJobAnalysisId] = useState(null);
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const notify = (text) => message.info(text);
  function openJobForm() {
    setJobFormOpen(true);
  }
  function jobAnalysisMessage(analysis, status) {
    return (
      <div className="job-chat-result">
        <p>
          {status === "processing"
            ? "已创建岗位分析任务，正在整理演示报告…"
            : "岗位分析流程演示已完成，报告已整理好。"}
        </p>
        <div className={`job-chat-result-card ${status === "processing" ? "processing" : ""}`}>
          <div className="job-chat-result-icon">
            <AimOutlined />
          </div>
          <div>
            <strong>{analysis.role}</strong>
            <span>{analysis.company || analysis.resumeTitle}</span>
            <small>
              {status === "processing"
                ? "JD 解析 → 简历诊断 → 求职准备"
                : "JD 解析 · 简历诊断 · 经历追问 · 面试准备"}
            </small>
          </div>
          {status === "complete" && (
            <Button
              type="link"
              onClick={() => {
                setSelectedJobAnalysisId(analysis.id);
                setPage("jobs");
                setFull(false);
              }}
            >
              查看完整报告 <ArrowRightOutlined />
            </Button>
          )}
        </div>
        <small className="demo-note">
          {status === "processing"
            ? "演示流程处理中 · 未调用 AI 或岗位分析服务"
            : "演示流程 · 未调用 AI 或岗位分析服务"}
        </small>
      </div>
    );
  }
  function submitJobAnalysis(values, { source = "jobs", messageKey } = {}) {
    const resume = resumeItems.find((item) => item.id === values.resumeId);
    if (!resume) return;
    const id = `job-${Date.now()}`;
    const analysis = {
      ...values,
      id,
      resumeTitle: resume.title,
      createdAt: new Date().toLocaleDateString("zh-CN"),
      status: "processing",
    };
    setJobAnalyses((items) => [analysis, ...items]);
    setSelectedJobAnalysisId(id);
    if (source === "jobs") setJobFormOpen(false);
    if (source === "agent" && messageKey) {
      setHistories((items) => ({
        ...items,
        [session]: (items[session] || []).map((item) =>
          item.key === messageKey
            ? { ...item, content: jobAnalysisMessage(analysis, "processing") }
            : item,
        ),
      }));
    }
    window.setTimeout(() => {
      const completed = { ...analysis, status: "complete" };
      setJobAnalyses((items) =>
        items.map((item) => (item.id === id ? completed : item)),
      );
      if (source === "agent" && messageKey) {
        setHistories((items) => ({
          ...items,
          [session]: (items[session] || []).map((item) =>
            item.key === messageKey
              ? { ...item, content: jobAnalysisMessage(completed, "complete") }
              : item,
          ),
        }));
      }
    }, 1200);
  }
  function openJobAnalysisInChat() {
    setPage("agent");
    setEditing(false);
    const messageKey = `job-form-${Date.now()}`;
    setHistories((items) => ({
      ...items,
      [session]: [
        ...(items[session] || []),
        {
          key: messageKey,
          role: "assistant",
          content: (
            <JobAnalysisInlineForm
              selectedResumeId={currentResume.id}
              selectedResumeTitle={currentResume.title}
              onCancel={() =>
                setHistories((history) => ({
                  ...history,
                  [session]: (history[session] || []).filter(
                    (item) => item.key !== messageKey,
                  ),
                }))
              }
              onSubmit={(values) =>
                submitJobAnalysis(values, { source: "agent", messageKey })
              }
            />
          ),
        },
      ],
    }));
  }
  function open(key) {
    if (key === "interview") {
      setPage("interview");
      setFull(false);
      return;
    }
    setPanels((p) => (p.includes(key) ? p : [...p, key]));
    setActive(key);
  }
  function newChat() {
    setEditing(false);
    setPage("agent");
    const key = String(Date.now());
    setSessions((p) => [{ key, label: "新会话" }, ...p]);
    setHistories((p) => ({ ...p, [key]: [] }));
    setSession(key);
    setValue("");
  }
  function send(text) {
    if (!text.trim()) return;
    const isInterview = text.includes("面试"),
      isJob = text.includes("岗位") || text.includes("匹配");
    const reply = isInterview
      ? "我们可以围绕你的项目经历、React 基础和工程实践准备面试。右侧已打开面试准备，可以先查看练习方向。"
      : isJob
        ? "我先收集目标岗位和简历信息，再把 JD 解析、简历诊断与后续准备建议整理在这次对话里。"
        : "建议先明确你在项目中的具体职责，再补充解决问题的方法与真实结果。右侧示例简历可供对照；正式版本会基于你提供的经历给出修改建议。";
    setHistories((p) => ({
      ...p,
      [session]: [
        ...(p[session] || []),
        { key: `${Date.now()}u`, role: "user", content: text },
        {
          key: `${Date.now()}a`,
          role: "assistant",
          content: (
            <div>
              <p>{reply}</p>
              <small className="demo-note">
                演示回复 · 未调用 AI，不代表真实分析
              </small>
            </div>
          ),
        },
      ],
    }));
    if (isInterview) open("interview");
    else if (isJob) openJobAnalysisInChat();
    else open("resume");
    setValue("");
  }
  function content(key) {
    if (key === "resume")
      return (
        <Resume
          key={currentResume.id}
          doc={currentResume}
          onEdit={() => editResume(currentResume)}
        />
      );
    if (key === "preferences") return <Preferences notify={notify} />;
    if (key === "profile")
      return (
        <AboutMe
          doc={currentResume}
          onChange={updateResume}
          notify={notify}
        />
      );
    return (
      <div className="panel-scroll">
        <div className="form-card">
          <h3>
            <span />
            面试准备
          </h3>
          <p className="muted">从简历出发，准备有针对性的回答。</p>
          {[
            "请介绍一个你负责的前端项目。",
            "你如何设计可复用的 React 组件？",
            "遇到页面性能问题时，你会如何排查？",
          ].map((q, i) => (
            <div className="question" key={q}>
              <Tag color="green">0{i + 1}</Tag>
              <span>{q}</span>
            </div>
          ))}
          <Button
            type="primary"
            className="panel-primary"
            onClick={() => send("请帮我准备前端技术面试")}
          >
            在对话中练习 <ArrowRightOutlined />
          </Button>
          <p className="demo-note">示例题目 · 非真实模拟面试</p>
        </div>
      </div>
    );
  }
  const nav = [
    ["agent", <ThunderboltOutlined />, "Agent"],
    ["resume", <FileTextOutlined />, "我的简历"],
    ["jobs", <AimOutlined />, "岗位匹配"],
    ["interview", <AudioOutlined />, "模拟面试"],
  ];
  if (authMode)
    return (
      <AuthPage
        key={authMode}
        initialMode={authMode}
        onBack={() => setAuthMode(null)}
        onSuccess={(data) => {
          setAccount(data);
          setAuthMode(null);
          setPage("agent");
        }}
      />
    );
  const topbar = (
    <header className="topbar">
      <div>
        <Button
          aria-label={sidebar ? "收起侧栏" : "展开侧栏"}
          type="text"
          icon={sidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={() => setSidebar((p) => !p)}
        />
        <span className="topbar-title">
          {page === "jobs"
            ? "岗位分析报告"
            : page === "resumes"
              ? "我的简历"
              : "求职准备，从这里开始"}
        </span>
      </div>
      <Tag>演示模式</Tag>
    </header>
  );
  return (
    <div
      className={`app-shell ${sidebar ? "sidebar-open" : ""} ${full ? "workspace-full" : ""}`}
    >
      {sidebar && (
        <>
          <div className="sidebar-backdrop" onClick={() => setSidebar(false)} />
          <aside className="sidebar">
            <div className="brand">
              <span className="brand-mark">
                <ThunderboltOutlined />
              </span>
              <strong>简历工作台</strong>
              <Button
                type="text"
                aria-label="收起导航"
                icon={<MenuFoldOutlined />}
                onClick={() => setSidebar(false)}
              />
            </div>
            <nav>
              {nav.map(([key, icon, label]) => (
                <button
                  key={key}
                  className={`nav-item ${(page === "resumes" || page === "resume-preview" ? key === "resume" : page === "interview" ? key === "interview" : page === "jobs" ? key === "jobs" : page === "settings" ? false : key === "agent") ? "selected" : ""}`}
                  onClick={() => {
                    if (key === "agent") {
                      setEditing(false);
                      setFull(false);
                      setPage("agent");
                    } else if (key === "interview") {
                      open(key);
                    } else if (key === "resume") {
                      setFull(false);
                      setPage("resumes");
                    } else if (key === "jobs") {
                      setFull(false);
                      setPage("jobs");
                    } else {
                      setPage("agent");
                      open(key);
                    }
                    if (innerWidth < 700) setSidebar(false);
                  }}
                >
                  {icon}
                  <span>{label}</span>
                  {key === "agent" && <span className="nav-beta">BETA</span>}
                </button>
              ))}
            </nav>
            <div className="history-title">
              <span>历史对话</span>
              <Button
                type="text"
                aria-label="新建会话"
                size="small"
                icon={<PlusOutlined />}
                onClick={newChat}
              />
            </div>
            <Conversations
              items={sessions}
              activeKey={session}
              onActiveChange={(key) => {
                setEditing(false);
                setPage("agent");
                setSession(key);
                setValue("");
                if (innerWidth < 700) setSidebar(false);
              }}
              menu={(item) => ({
                items: [{ key: "delete", label: "删除会话", danger: true }],
                onClick: () => {
                  setSessions((p) => p.filter((s) => s.key !== item.key));
                  if (session === item.key) newChat();
                },
              })}
            />
            <div className="sidebar-footer">
              <div className="account">
                <Avatar style={{ background: "#1e4aff" }}>
                  {account.name.slice(0, 1)}
                </Avatar>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="账户设置"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setPage("settings");
                    setFull(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPage("settings");
                      setFull(false);
                    }
                  }}
                >
                  <strong>{account.name}</strong>
                  <small>把每一次准备，变成机会</small>
                </div>
                <Button
                  type="text"
                  aria-label="设置"
                  icon={<SettingOutlined />}
                  onClick={() => {
                    setPage("settings");
                    setFull(false);
                  }}
                />
              </div>
              <div className="prototype-label">
                <span className="status-dot" />
                交互原型 <span>仅演示</span>
              </div>
              <small className="copyright">AI 求职简历工作台</small>
            </div>
          </aside>
        </>
      )}
      <main className="main-shell">
        {page !== "agent" && page !== "interview" && topbar}
        <div className="split-area">
          {page === "resume-preview" ? (
            <ResumePreviewPage
              doc={currentResume}
              renderResume={(doc) => <Resume doc={doc} />}
              onBack={() => setPage("resumes")}
              onEdit={editResume}
            />
          ) : page === "resumes" ? (
            <ResumeLibrary
              onPreview={(doc) => {
                setSelectedResume(doc);
                setPage("resume-preview");
                setFull(false);
              }}
              onAiCreate={() => {
                newChat();
                setValue("帮我从零创建一份简历");
                setPanels([]);
              }}
              items={resumeItems}
              onItemsChange={setResumeItems}
              onEdit={editResume}
              renderResume={(doc) => <Resume doc={doc} />}
            />
          ) : page === "settings" ? (
            <AccountSettings
              account={account}
              onAccountChange={setAccount}
              onAuth={setAuthMode}
            />
          ) : page === "jobs" ? (
            <JobAnalysisPage
              analyses={jobAnalyses}
              selectedAnalysisId={selectedJobAnalysisId}
              onBack={() => setSelectedJobAnalysisId(null)}
              onCreate={openJobForm}
              resumes={resumeItems}
            />
          ) : page === "interview" ? (
            <Interview
              resume={<Resume doc={currentResume} />}
              onToggleSidebar={() => setSidebar((p) => !p)}
              sidebarOpen={sidebar}
              resumes={resumeItems}
              selectedResumeId={currentResume.id}
              onResumeChange={(id) => {
                const selected = resumeItems.find((item) => item.id === id);
                if (selected) setSelectedResume(selected);
              }}
            />
          ) : (
            <Splitter>
              <Splitter.Panel
                defaultSize="48%"
                min={300}
                style={{ display: full ? "none" : undefined }}
              >
                <div className="chat-pane">
                  <div className="chat-header agent-conversation-header">
                    <Button
                      aria-label={sidebar ? "收起侧栏" : "展开侧栏"}
                      type="text"
                      size="small"
                      icon={sidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                      onClick={() => setSidebar((p) => !p)}
                    />
                    <div className="chat-title">
                      <Button
                        aria-label="新建对话"
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={newChat}
                      />
                      <span>
                        {sessions.find((s) => s.key === session)?.label || "新会话"}
                      </span>
                    </div>
                    <Dropdown
                      trigger={["click"]}
                      placement="bottomRight"
                      open={resumeMenuOpen}
                      onOpenChange={setResumeMenuOpen}
                      popupRender={() => (
                        <div className="agent-resume-picker">
                          <strong>我的简历</strong>
                          <div className="agent-resume-picker-list">
                            {resumeItems.map((item) => (
                              <button
                                className={`agent-resume-picker-item ${item.id === currentResume.id ? "selected" : ""}`}
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setSelectedResume(item);
                                  setResumeMenuOpen(false);
                                  open("resume");
                                }}
                              >
                                <FileTextOutlined />
                                <span>
                                  <span className="agent-resume-picker-title">
                                    {item.title}
                                  </span>
                                  <small>{item.date} · 最近更新</small>
                                </span>
                                {item.id === currentResume.id && <CheckOutlined />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    >
                      <Button
                        size="small"
                        shape="round"
                        icon={<FileTextOutlined />}
                        aria-label="选择简历"
                      >
                        我的简历
                      </Button>
                    </Dropdown>
                  </div>
                  <div
                    className="agent-editor-pane"
                    style={{ display: editing ? undefined : "none" }}
                  >
                    <div className="agent-edit-heading">
                      <strong>编辑简历</strong>
                      <Button
                        type="text"
                        size="small"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => setEditing(false)}
                      >
                        返回对话
                      </Button>
                    </div>
                    <ResumeEditor
                      key={currentResume.id}
                      doc={currentResume}
                      onChange={updateResume}
                    />
                  </div>
                  <div
                    className="chat-conversation"
                    style={{ display: editing ? "none" : undefined }}
                  >
                    <div className="chat-scroll">
                      {(histories[session] || []).length ? (
                        <>
                          <div className="date-label">今天</div>
                          <Bubble.List
                            items={histories[session]}
                            role={roles}
                          />
                          <div className="chat-next">
                            <button onClick={() => send("帮我优化项目经历")}>
                              优化项目经历 <ArrowRightOutlined />
                            </button>
                            <button onClick={() => open("preferences")}>
                              完善求职偏好 <ArrowRightOutlined />
                            </button>
                          </div>
                          <button
                            className="manual-edit-link"
                            onClick={() => editResume(currentResume)}
                          >
                            <EditOutlined />
                            手动编辑简历
                          </button>
                        </>
                      ) : (
                        <div className="empty-chat">
                          <Avatar
                            className="ai-avatar"
                            size={48}
                            icon={<ThunderboltOutlined />}
                          />
                          <h2>一起准备你的下一份机会</h2>
                          <p>从一份好简历开始，让你的经历被看见。</p>
                          {[
                            "帮我从零创建一份简历",
                            "帮我优化项目经历",
                            "准备一场前端技术面试",
                          ].map((t) => (
                            <Button key={t} onClick={() => send(t)}>
                              {t}
                              <ArrowRightOutlined />
                            </Button>
                          ))}
                          <button
                            className="manual-edit-link"
                            onClick={() => editResume(currentResume)}
                          >
                            <EditOutlined />
                            我想手动编辑简历
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="composer">
                      <div className="file-list">
                        {files.map((f) => (
                          <Tag
                            key={f.uid}
                            closable
                            onClose={() =>
                              setFiles((p) => p.filter((x) => x.uid !== f.uid))
                            }
                            icon={<PaperClipOutlined />}
                          >
                            {f.name}
                          </Tag>
                        ))}
                      </div>
                      <Sender
                        value={value}
                        onChange={setValue}
                        onSubmit={send}
                        placeholder="告诉 AI 你的求职需求…"
                        autoSize={{ minRows: 2, maxRows: 5 }}
                        footer={
                          <div className="sender-footer">
                            <div className="quick-actions">
                              <Button
                                size="small"
                                shape="round"
                                icon={<AimOutlined />}
                                onClick={() => open("preferences")}
                              >
                                求职偏好
                              </Button>
                              <Button
                                size="small"
                                shape="round"
                                icon={<FileTextOutlined />}
                                onClick={openJobAnalysisInChat}
                              >
                                岗位匹配
                              </Button>
                              <Button
                                size="small"
                                shape="round"
                                icon={<UserOutlined />}
                                onClick={() => open("profile")}
                              >
                                关于我
                              </Button>
                            </div>
                            <Upload
                              beforeUpload={(file) => {
                                setFiles((p) => [
                                  ...p,
                                  { uid: file.uid, name: file.name },
                                ]);
                                notify("附件仅展示文件名，未上传或解析");
                                return false;
                              }}
                              showUploadList={false}
                              accept=".pdf,.doc,.docx,.png,.jpg"
                            >
                              <Tooltip title="添加附件（仅本地展示）">
                                <Button
                                  aria-label="添加附件"
                                  size="small"
                                  type="text"
                                  icon={<PaperClipOutlined />}
                                />
                              </Tooltip>
                            </Upload>
                          </div>
                        }
                      />
                      <div className="composer-caption">
                        AI 内容仅供参考，请确保简历信息真实准确{" "}
                        <span>演示数据</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Splitter.Panel>
              {panels.length > 0 && (
                <Splitter.Panel min={300}>
                  <div className="workspace">
                    <Tabs
                      type="editable-card"
                      hideAdd
                      activeKey={active}
                      onChange={setActive}
                      onEdit={(key, action) => {
                        if (action === "remove") {
                          const next = panels.filter((p) => p !== key);
                          setPanels(next);
                          if (active === key) setActive(next.at(-1));
                          setFull(false);
                        }
                      }}
                      tabBarExtraContent={
                        <div className="workspace-actions">
                          <Button
                            size="small"
                            aria-label="全屏工作区"
                            type="text"
                            icon={
                              full ? <CompressOutlined /> : <ExpandOutlined />
                            }
                            onClick={() => setFull((p) => !p)}
                          />
                          <Button
                            size="small"
                            aria-label="关闭工作区"
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => {
                              setPanels([]);
                              setFull(false);
                            }}
                          />
                        </div>
                      }
                      items={panels.map((key) => ({
                        key,
                        label: (
                          <span>
                            {key === "resume" ? (
                              <FileTextOutlined />
                            ) : key === "preferences" ? (
                              <AimOutlined />
                            ) : (
                              <UserOutlined />
                            )}{" "}
                            {key === "resume"
                              ? currentResume.title
                              : labels[key]}
                          </span>
                        ),
                        children: content(key),
                      }))}
                    />
                  </div>
                </Splitter.Panel>
              )}
            </Splitter>
          )}
        </div>
      </main>
      <JobAnalysisForm
        open={jobFormOpen}
        resumes={resumeItems}
        selectedResumeId={currentResume.id}
        onCancel={() => setJobFormOpen(false)}
        onSubmit={(values) => submitJobAnalysis(values, { source: "jobs" })}
      />
    </div>
  );
}
export function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1e4aff",
          colorLink: "#1e4aff",
          colorLinkHover: "#5272ff",
          colorLinkActive: "#173ddd",
          colorInfo: "#1e4aff",
          colorText: "#111213",
          colorTextSecondary: "#5b6172",
          colorTextTertiary: "#8b91a1",
          colorBorder: "#e5e5e5",
          colorBgBase: "#ffffff",
          colorBgContainer: "#ffffff",
          colorBgLayout: "#f7f8fb",
          borderRadius: 8,
          fontSize: 13,
          fontFamily:
            '"IBM Plex Sans", "Microsoft YaHei", -apple-system, sans-serif',
        },
        components: {
          Tabs: { cardBg: "#ffffff" },
          Radio: { buttonBg: "#ffffff" },
        },
      }}
    >
      <AntApp>
        <Experience />
      </AntApp>
    </ConfigProvider>
  );
}
