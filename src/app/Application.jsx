import { initialSessions } from "../mocks/agent.jsx";
import { initialAccount } from "../mocks/account.js";
import { JobAnalysisMessage } from "../pages/agent/components/JobAnalysisMessage.jsx";
import React, { useRef, useState } from "react";
import { ResumeLibrary } from "../pages/resume/ResumeLibrary.jsx";
import { exampleResumes } from "../mocks/resumes.js";
import { ResumePreviewPage } from "../pages/resume/ResumePreviewPage.jsx";
import { SidebarToggleButton } from "../components/SidebarToggleButton.jsx";

import { Interview } from "../pages/interview/Interview.jsx";
import { InterviewLibrary } from "../pages/interview/InterviewLibrary.jsx";

import { AccountSettings } from "../pages/account/AccountSettings.jsx";
import { AuthPage } from "../pages/account/AuthPage.jsx";
import { JobAnalysisPage } from "../pages/job-analysis/JobAnalysisPage.jsx";
import { JobAnalysisForm } from "../pages/job-analysis/modals/JobAnalysisModal.jsx";
import { JobAnalysisInlineForm } from "../pages/job-analysis/forms/JobAnalysisInlineForm.jsx";
import { App as AntApp, Button, Avatar, Tag } from "antd";

import Conversations from "@ant-design/x/es/conversations/index.js";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  FileTextOutlined,
  AimOutlined,
  AudioOutlined,
  ThunderboltOutlined,
  SettingOutlined,
} from "../components/icons.js";

import { AgentPage } from "../pages/agent/AgentPage.jsx";
import { Resume } from "../pages/agent/panels/ResumePanel.jsx";
import { Preferences } from "../pages/agent/panels/PreferencesPanel.jsx";
import { ProfilePanel } from "../pages/agent/panels/ProfilePanel.jsx";
import { InterviewPreparationPanel } from "../pages/agent/panels/InterviewPreparationPanel.jsx";
import { initial } from "../mocks/agent.jsx";
export function Application() {
  const { message } = AntApp.useApp();
  const [page, setPage] = useState("agent");
  const [interviewRecords, setInterviewRecords] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviewKey, setInterviewKey] = useState(0);
  const interviewNavigation = useRef(null);
  function startInterview() {
    setSelectedInterview(null);
    setInterviewKey((key) => key + 1);
    setFull(false);
    setPage("interview-session");
  }
  const [editing, setEditing] = useState(false);
  const [templateSelecting, setTemplateSelecting] = useState(false);
  const [resumeItems, setResumeItems] = useState(exampleResumes);
  const [selectedResume, setSelectedResume] = useState(exampleResumes[0]);
  const [resumeMenuOpen, setResumeMenuOpen] = useState(false);
  const currentResume =
    resumeItems.find((item) => item.id === selectedResume.id) || selectedResume;
  function openTemplatePicker() {
    setEditing(false);
    setTemplateSelecting(true);
    setFull(false);
    setPage("agent");
  }
  function editResume(doc) {
    setSelectedResume(doc);
    setEditing(true);
    setTemplateSelecting(false);
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
  function updateResumeTemplate(doc, templateId) {
    setResumeItems((items) =>
      items.map((item) =>
        item.id === doc.id ? { ...item, templateId } : item,
      ),
    );
    setSelectedResume((item) =>
      item.id === doc.id ? { ...item, templateId } : item,
    );
    setSelectedInterview((record) =>
      record?.resume?.id === doc.id
        ? { ...record, resume: { ...record.resume, templateId } }
        : record,
    );
  }

  const [authMode, setAuthMode] = useState(null);
  const [account, setAccount] = useState(initialAccount);
  const [sidebar, setSidebar] = useState(() => innerWidth > 1000),
    [panels, setPanels] = useState(["resume"]),
    [active, setActive] = useState("resume"),
    [full, setFull] = useState(false),
    [value, setValue] = useState(""),
    [session, setSession] = useState("1"),
    [files, setFiles] = useState([]);
  const [sessions, setSessions] = useState(initialSessions);
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
      <JobAnalysisMessage
        analysis={analysis}
        status={status}
        setSelectedJobAnalysisId={setSelectedJobAnalysisId}
        setPage={setPage}
        setFull={setFull}
      />
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
      startInterview();
      return;
    }
    setPanels([key]);
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
          onTemplateChange={updateResumeTemplate}
          onOpenTemplatePicker={openTemplatePicker}
        />
      );
    if (key === "preferences") return <Preferences notify={notify} />;
    if (key === "profile")
      return (
        <ProfilePanel
          doc={currentResume}
          onChange={updateResume}
          notify={notify}
        />
      );
    return <InterviewPreparationPanel send={send} />;
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
        <SidebarToggleButton
          expanded={sidebar}
          onExpand={() => setSidebar(true)}
        />
        <span className="topbar-title">
          {page === "jobs"
            ? "岗位分析报告"
            : page === "resumes"
              ? "我的简历"
              : page === "interview"
                ? "模拟面试"
              : page === "settings"
                ? "账户设置"
              : "求职准备，从这里开始"}
        </span>
      </div>
      <Tag>演示模式</Tag>
    </header>
  );
  return (
    <div
      className={`app-shell ${sidebar ? "sidebar-open" : "sidebar-collapsed"} ${full ? "workspace-full" : ""}`}
    >
      <div className="sidebar-backdrop" onClick={() => setSidebar(false)} />
      <aside className="sidebar">
            <div className="brand">
              <span className="brand-mark">
                <ThunderboltOutlined />
              </span>
              <strong>简历工作台</strong>
              <Button
                type="text"
                aria-label={sidebar ? "收起导航" : "展开导航"}
                title={sidebar ? "收起导航" : "展开导航"}
                icon={sidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                onClick={() => setSidebar((isOpen) => !isOpen)}
              />
            </div>
            <nav>
              {nav.map(([key, icon, label]) => (
                <button
                  key={key}
                  title={label}
                  aria-label={label}
                  className={`nav-item ${(page === "resumes" || page === "resume-preview" ? key === "resume" : page === "interview" || page === "interview-session" ? key === "interview" : page === "jobs" ? key === "jobs" : page === "settings" ? false : key === "agent") ? "selected" : ""}`}
                  onClick={() => {
                    if (key === "agent") {
                      setEditing(false);
                      setFull(false);
                      setPage("agent");
                    } else if (key === "interview") {
                      if (page === "interview-session") {
                        interviewNavigation.current?.returnToRecords();
                      } else {
                        setFull(false);
                        setPage("interview");
                      }
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
      <main className="main-shell">
        {page !== "agent" && page !== "interview-session" && topbar}
        <div className="split-area">
          {page === "resume-preview" ? (
            <ResumePreviewPage
              doc={currentResume}
              renderResume={(doc) => (
                <Resume doc={doc} onTemplateChange={updateResumeTemplate} />
              )}
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
              renderResume={(doc) => (
                <Resume doc={doc} onTemplateChange={updateResumeTemplate} />
              )}
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
            <InterviewLibrary
              records={interviewRecords}
              onStart={startInterview}
              onReview={(record) => {
                setSelectedInterview(record);
                setInterviewKey((key) => key + 1);
                setPage("interview-session");
              }}
            />
          ) : page === "interview-session" ? (
            <Interview
              ref={interviewNavigation}
              key={interviewKey}
              initialRecord={selectedInterview}
              workspaceFull={full}
              onWorkspaceFullChange={setFull}
              onBack={() => {
                setFull(false);
                setPage("interview");
              }}
              onFinish={(record) =>
                setInterviewRecords((records) => [
                  record,
                  ...records.filter((item) => item.id !== record.id),
                ])
              }
              resume={
                <Resume
                  doc={selectedInterview?.resume || currentResume}
                  showToolbar={false}
                />
              }
              onExpandSidebar={() => setSidebar(true)}
              sidebarOpen={sidebar}
              resumes={resumeItems}
              selectedResumeId={currentResume.id}
              onResumeChange={(id) => {
                const selected = resumeItems.find((item) => item.id === id);
                setSelectedInterview(null);
                if (selected) setSelectedResume(selected);
              }}
            />
          ) : (
            <AgentPage
              editResume={editResume}
              setFull={setFull}
              full={full}
              sidebar={sidebar}
              onExpandSidebar={() => setSidebar(true)}
              sessions={sessions}
              session={session}
              newChat={newChat}
              resumeMenuOpen={resumeMenuOpen}
              setResumeMenuOpen={setResumeMenuOpen}
              resumeItems={resumeItems}
              currentResume={currentResume}
              setSelectedResume={setSelectedResume}
              open={open}
              editing={editing}
              setEditing={setEditing}
              templateSelecting={templateSelecting}
              setTemplateSelecting={setTemplateSelecting}
              onTemplateSelect={(templateId) =>
                updateResumeTemplate(currentResume, templateId)
              }
              updateResume={updateResume}
              histories={histories}
              send={send}
              value={value}
              setValue={setValue}
              files={files}
              setFiles={setFiles}
              notify={notify}
              panels={panels}
              active={active}
              setActive={setActive}
              setPanels={setPanels}
              content={content}
              openJobAnalysisInChat={openJobAnalysisInChat}
            />
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
