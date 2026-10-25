import { InterviewSettingsContent } from "./modals/InterviewSettingsContent.jsx";
import { Workspace } from "../../components/Workspace.jsx";
import { ResumePicker } from "../../components/ResumePicker.jsx";
import { SidebarToggleButton } from "../../components/SidebarToggleButton.jsx";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Avatar, Button, Input, Select, Tag, Progress, Modal } from "antd";
import {
  SoundOutlined,
  AudioOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  CodeOutlined,
  EditOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
} from "../../components/icons.js";
import {
  PhoneOutlined,
  AudioMutedOutlined,
  MessageOutlined,
  ReloadOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import Bubble from "@ant-design/x/es/bubble/index.js";
import Sender from "@ant-design/x/es/sender/index.js";
import "./interview.css";
import "./unified-call.css";

import { questions, examples } from "../../mocks/interview.js";
const interviewTypes = [
  {
    title: "综合面",
    description: "覆盖专业能力、项目经验与沟通表达，一轮看清综合水位。",
    selectedDescription:
      "适合小厂 / 创业公司一轮定音的面试。专业与非专业并重，看的是综合水位。",
    topics: ["项目深挖", "方案权衡", "业务理解"],
    icon: <ProjectOutlined />,
  },
  {
    title: "专业能力面",
    description: "聚焦专业技能与深度，考察岗位匹配的专业能力。",
    selectedDescription:
      "适合中大厂的二面。环节按目标岗位自动编排，会顺着一个点一直追问到底。",
    topics: ["专业原理", "项目深挖", "实操排查"],
    icon: <CodeOutlined />,
  },
  {
    title: "HR 面试",
    description: "以沟通、动机、价值观等为主，考察职业素养与稳定性。",
    selectedDescription:
      "适合中大厂的第一轮。不使用题库，结合你的简历按六个环节即兴推进。",
    topics: ["自我介绍", "求职动机", "项目经历"],
    icon: <MessageOutlined />,
  },
];
const interviewRoles = {
  assistant: {
    placement: "start",
    variant: "borderless",
    avatar: <Avatar className="interviewer-avatar" icon={<AudioOutlined />} />,
  },
  user: { placement: "end", variant: "filled" },
};

export function Interview({
  ref,
  resume,
  onExpandSidebar,
  sidebarOpen,
  resumes = [],
  selectedResumeId,
  onResumeChange,
  onBack,
  onFinish,
  initialRecord,
  workspaceFull = false,
  onWorkspaceFullChange,
}) {
  const [stage, setStage] = useState(initialRecord ? "review" : "setup");
  const [job, setJob] = useState(initialRecord?.job || "前端开发工程师");
  const [resumeId, setResumeId] = useState(
    initialRecord?.resume?.id || selectedResumeId || resumes[0]?.id,
  );
  const [kind, setKind] = useState(initialRecord?.kind || "综合面");
  const [mic, setMic] = useState(initialRecord?.mode !== "text");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [interviewer, setInterviewer] = useState("女面试官");
  const [micTested, setMicTested] = useState(false);
  const [speakerTested, setSpeakerTested] = useState(false);
  const [mode, setMode] = useState(initialRecord?.mode || "voice");
  const [muted, setMuted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState(initialRecord?.answers || []);
  const [messages, setMessages] = useState(initialRecord?.messages || []);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("speaking");
  const [caption, setCaption] = useState("");
  const [elapsed, setElapsed] = useState(initialRecord?.elapsed || 0);
  const [speaker, setSpeaker] = useState(true);
  const [resumeVisible, setResumeVisible] = useState(true);
  const [resumeMenuOpen, setResumeMenuOpen] = useState(false);
  const resumeToggleRef = useRef(null);
  useEffect(() => {
    if (!resumeVisible) resumeToggleRef.current?.focus();
  }, [resumeVisible]);
  const scrollRef = useRef(null);
  const runId = useRef(initialRecord?.id || null);
  const savedId = useRef(initialRecord?.id || null);
  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);
  function saveRecord(status) {
    if (!runId.current || savedId.current === runId.current) return;
    savedId.current = runId.current;
    finishRef.current?.({
      id: runId.current,
      job,
      kind,
      mode,
      elapsed,
      answers,
      messages,
      status,
      score: null,
      createdAt: new Date().toLocaleString("zh-CN"),
      resume:
        initialRecord?.resume || resumes.find((item) => item.id === resumeId),
    });
  }
  useEffect(() => {
    if (stage === "review") saveRecord("ended");
  }, [
    stage,
    job,
    kind,
    mode,
    elapsed,
    answers,
    messages,
    resumeId,
    resumes,
    initialRecord,
  ]);
  function requestLeave(next, preparing = false) {
    if (stage !== "live") {
      next?.();
      return;
    }
    Modal.confirm({
      title: preparing
        ? "结束本次练习并重新准备？"
        : "结束本次练习并返回记录？",
      content: "本次练习将标记为已放弃，仅保留在当前演示会话中。",
      okText: preparing ? "结束并重新准备" : "结束并返回",
      cancelText: "继续面试",
      onOk: () => {
        saveRecord("abandoned");
        next?.();
      },
    });
  }
  function returnToRecords() {
    requestLeave(onBack);
  }
  function prepareAgain() {
    requestLeave(() => setStage("setup"), true);
  }
  useImperativeHandle(ref, () => ({ returnToRecords }));
  useEffect(() => {
    if (stage !== "live") return;
    const id = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [stage]);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, caption]);
  useEffect(() => {
    if (stage !== "live" || mode !== "voice" || muted) return;
    const text = phase === "speaking" ? questions[index] : examples[index];
    let offset = 0;
    setCaption("");
    const timer = setInterval(() => {
      offset = Math.min(offset + 3, text.length);
      setCaption(text.slice(0, offset));
    }, 110);
    const finish = setTimeout(
      () => {
        clearInterval(timer);
        setCaption("");
        if (phase === "speaking") {
          setMessages((p) =>
            p.some((m) => m.key === `q${index}`)
              ? p
              : [
                  ...p,
                  {
                    key: `q${index}`,
                    role: "assistant",
                    content: questions[index],
                  },
                ],
          );
          setPhase("listening");
        } else {
          setAnswers((p) => [...p, examples[index]]);
          setMessages((p) => [
            ...p,
            { key: `a${index}`, role: "user", content: examples[index] },
          ]);
          if (index < questions.length - 1) {
            setIndex((n) => n + 1);
            setPhase("speaking");
          } else {
            setStage("review");
          }
        }
      },
      Math.ceil(text.length / 3) * 110 + (phase === "speaking" ? 1600 : 3500),
    );
    return () => {
      clearInterval(timer);
      clearTimeout(finish);
    };
  }, [stage, mode, muted, index, phase]);
  function start() {
    runId.current = `interview-${Date.now()}`;
    setStage("live");
    setMode(mic ? "voice" : "text");
    setMuted(false);
    setIndex(0);
    setAnswers([]);
    setAnswer("");
    setElapsed(0);
    setPhase("speaking");
    setCaption("");
    setMessages(
      mic ? [] : [{ key: "q0", role: "assistant", content: questions[0] }],
    );
  }
  function submit(text) {
    if (!text.trim()) return;
    const next = [...answers, text];
    setAnswers(next);
    setAnswer("");
    setMessages((p) => [
      ...p,
      { key: `a${index}`, role: "user", content: text },
      ...(index < 2
        ? [
            {
              key: `q${index + 1}`,
              role: "assistant",
              content: questions[index + 1],
            },
          ]
        : [
            {
              key: "done",
              role: "assistant",
              content: "这轮练习已完成。你可以查看问答回顾，再练一轮。",
            },
          ]),
    ]);
    if (index < 2) {
      setIndex(index + 1);
      setPhase("speaking");
    } else setStage("review");
  }
  const isLive = stage === "live";
  const sessionTitle =
    stage === "setup"
      ? "准备一场前端技术面试"
      : stage === "live"
        ? `${job} · 模拟面试`
        : `面试复盘 · ${job}`;
  return (
    <div
      className={`interview-layout ${isLive ? "interview-in-progress" : ""} ${resumeVisible ? "" : "interview-resume-hidden"} ${workspaceFull ? "interview-preview-full" : ""}`}
    >
      <section className="interview-left">
        <header className="chat-header agent-conversation-header interview-session-header">
          <SidebarToggleButton
            expanded={sidebarOpen}
            onExpand={onExpandSidebar}
          />
          <Button
            type="text"
            size="small"
            aria-label="返回面试记录"
            title="返回面试记录"
            icon={<ArrowLeftOutlined />}
            onClick={returnToRecords}
          />
          <div className="chat-title">
            <Button
              aria-label="重新准备面试"
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={prepareAgain}
            />
            <span>{sessionTitle}</span>
            {isLive && (
              <small className="interview-session-status">
                <span className="call-dot" />
                {mode === "text"
                  ? "文字交流中"
                  : muted
                    ? "麦克风已静音"
                    : phase === "speaking"
                      ? "正在说话…"
                      : "正在聆听…"}
                <span className="unified-time">
                  {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
                  {String(elapsed % 60).padStart(2, "0")}
                </span>
              </small>
            )}
          </div>
          <ResumePicker
            items={resumes}
            selectedId={resumeId}
            open={resumeMenuOpen}
            onOpenChange={setResumeMenuOpen}
            buttonRef={resumeToggleRef}
            onSelect={(item) => {
              setResumeId(item.id);
              if (item.id !== resumeId) onResumeChange?.(item.id);
              setResumeVisible(true);
            }}
          />
        </header>
        {stage === "setup" ? (
          <div className="interview-setup-scroll">
            <div className="interview-setup">
              <label className="interview-label">
                简历 <em>*</em>
              </label>
              <Select
                aria-label="选择简历"
                value={resumeId}
                onChange={(value) => {
                  setResumeId(value);
                  onResumeChange?.(value);
                }}
                options={resumes.map((item) => ({
                  value: item.id,
                  label: (
                    <span className="interview-resume-option">
                      <FileTextOutlined />
                      <span>{item.title}</span>
                      <time>{item.date}</time>
                    </span>
                  ),
                }))}
                className="interview-select"
              />
              <label className="interview-label">
                目标岗位 <em>*</em>
              </label>
              <Input
                aria-label="目标岗位"
                value={job}
                onChange={(event) => setJob(event.target.value)}
                placeholder="输入目标岗位"
                className="interview-job-input"
              />
              <div className="interview-recommendations">
                <span>
                  <BulbOutlined /> 根据简历推荐：
                </span>
                {[
                  "前端开发工程师",
                  "软件开发工程师",
                  "全栈开发工程师",
                  "网页开发工程师",
                  "用户界面开发工程师",
                ].map((role) => (
                  <button
                    className={job === role ? "selected" : ""}
                    key={role}
                    type="button"
                    onClick={() => setJob(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <div className="interview-type-heading">
                <label className="interview-label">面试类型</label>
                <Button
                  aria-label="面试设置"
                  title="面试设置"
                  type="text"
                  size="small"
                  icon={<SettingOutlined />}
                  onClick={() => setSettingsOpen(true)}
                />
              </div>
              <div
                className="interview-type-grid"
                role="radiogroup"
                aria-label="面试类型"
              >
                {interviewTypes.map((type) => (
                  <button
                    aria-checked={kind === type.title}
                    className={`interview-type-card ${kind === type.title ? "selected" : ""}`}
                    key={type.title}
                    onClick={() => setKind(type.title)}
                    role="radio"
                    type="button"
                  >
                    <span className="interview-type-card-icon">
                      {type.icon}
                    </span>
                    {kind === type.title && (
                      <CheckCircleOutlined className="interview-type-check" />
                    )}
                    <strong>{type.title}</strong>
                    <small>
                      {kind === type.title
                        ? type.selectedDescription
                        : type.description}
                    </small>
                    {kind === type.title && (
                      <span className="interview-type-topics">
                        {type.topics.map((topic) => (
                          <i key={topic}>{topic}</i>
                        ))}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <Button type="primary" size="large" block onClick={start}>
                {mic ? "开始语音面试" : "开始文字面试"} <ArrowRightOutlined />
              </Button>
              <div className="interview-demo">
                交互演示 · 不使用真实麦克风，不连接语音或 AI 服务
              </div>
            </div>
          </div>
        ) : stage === "live" ? (
          <>
            <div className="unified-context">
              <span>
                <FileTextOutlined /> AI 求职简历工作台 <span>· {kind}</span>
              </span>
              <small>
                {index + 1} / {questions.length}
              </small>
            </div>
            <div className="interview-messages" ref={scrollRef}>
              <Bubble.List items={messages} role={interviewRoles} />
              {mode === "voice" && caption && (
                <div
                  className={`live-caption ${phase === "listening" ? "caption-user" : ""}`}
                >
                  <span>
                    {phase === "speaking" ? "面试官" : "我"} · 实时字幕（演示）
                  </span>
                  <p>
                    {caption}
                    <span className="caption-caret" />
                  </p>
                </div>
              )}
            </div>
            <div className="interview-controls">
              {mode === "voice" ? (
                <div className="unified-callbar">
                  <div className="unified-callhint">
                    <AudioOutlined />
                    <span>
                      {muted
                        ? "已静音"
                        : phase === "speaking"
                          ? "面试官正在说话"
                          : "直接说话即可回答"}
                      <small>文字同步保留</small>
                    </span>
                  </div>
                  <div className="unified-buttons">
                    <Button
                      type="text"
                      shape="circle"
                      aria-label={muted ? "取消静音" : "静音"}
                      title={muted ? "取消静音" : "静音"}
                      className={muted ? "is-off" : ""}
                      icon={muted ? <AudioMutedOutlined /> : <AudioOutlined />}
                      onClick={() => setMuted((p) => !p)}
                    />
                    <Button
                      type="text"
                      shape="circle"
                      aria-label="扬声器"
                      title={speaker ? "关闭扬声器" : "打开扬声器"}
                      className={speaker ? "" : "is-off"}
                      icon={<SoundOutlined />}
                      onClick={() => setSpeaker((p) => !p)}
                    />
                    <Button
                      type="text"
                      shape="circle"
                      aria-label="切换文字"
                      title="切换文字"
                      icon={<MessageOutlined />}
                      onClick={() => {
                        setCaption("");
                        setMessages((p) =>
                          p.some((m) => m.key === `q${index}`)
                            ? p
                            : [
                                ...p,
                                {
                                  key: `q${index}`,
                                  role: "assistant",
                                  content: questions[index],
                                },
                              ],
                        );
                        setMode("text");
                      }}
                    />
                    <Button
                      shape="circle"
                      className="unified-hangup"
                      aria-label="挂断"
                      title="结束面试"
                      icon={<PhoneOutlined />}
                      onClick={() => setStage("review")}
                    />
                  </div>
                </div>
              ) : (
                <Sender
                  value={answer}
                  onChange={setAnswer}
                  onSubmit={submit}
                  placeholder="输入你的回答，Enter 发送…"
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
              )}
              {mode === "text" && (
                <div className="interview-control-row">
                  <div>
                    <Button
                      size="small"
                      type="text"
                      onClick={() => setStage("review")}
                    >
                      结束面试
                    </Button>
                    <Button
                      size="small"
                      type="text"
                      icon={<PhoneOutlined />}
                      onClick={() => {
                        setPhase("listening");
                        setMode("voice");
                      }}
                    >
                      切换语音通话
                    </Button>
                  </div>
                </div>
              )}
              <div className="interview-demo">
                语音与字幕为自动演示 · 未录音
              </div>
            </div>
          </>
        ) : (
          <div className="interview-review">
            <div className="review-heading">
              <CheckCircleOutlined />
              <Tag>本轮练习结束</Tag>
              <h1>把练习，变成下一次的底气</h1>
              <p>
                已回答 {answers.length} / {questions.length} 个问题 · {kind}
              </p>
            </div>
            <div className="review-section">
              <h3>本轮练习记录</h3>
              <Progress
                percent={Math.round((answers.length / questions.length) * 100)}
                showInfo={false}
                strokeColor="#1e4aff"
                size="small"
              />
              {answers.length ? (
                answers.map((text, i) => (
                  <div className="review-answer" key={i}>
                    <span>问题 0{i + 1}</span>
                    <strong>{questions[i]}</strong>
                    <p>{text}</p>
                  </div>
                ))
              ) : (
                <p className="muted">还没有提交回答，可以重新开始练习。</p>
              )}
            </div>
            <div className="review-tips">
              <BulbTip />
              <div>
                <strong>下次可以这样准备</strong>
                <p>
                  用「背景 → 我的职责 → 具体行动 →
                  真实结果」组织项目介绍，提前准备关键方案的取舍理由。
                </p>
                <small>通用练习建议 · 非 AI 评分或个人能力判断</small>
              </div>
            </div>
            <div className="review-actions">
              <Button type="primary" icon={<ReloadOutlined />} onClick={start}>
                再练一轮
              </Button>
              <Button type="text" onClick={() => setStage("setup")}>
                返回面试准备
              </Button>
              <Button type="text" onClick={returnToRecords}>
                返回面试记录
              </Button>
            </div>
          </div>
        )}
      </section>
      <section
        className="interview-resume"
        id="interview-resume-preview"
        hidden={!resumeVisible}
      >
        <Workspace
          activeKey="resume"
          full={workspaceFull}
          onToggleFull={() => onWorkspaceFullChange?.(!workspaceFull)}
          onClose={() => {
            setResumeVisible(false);
            onWorkspaceFullChange?.(false);
          }}
          onRemove={() => {
            setResumeVisible(false);
            onWorkspaceFullChange?.(false);
          }}
          items={[
            {
              key: "resume",
              label: (
                <span>
                  <FileTextOutlined />{" "}
                  {initialRecord?.resume?.title ||
                    resumes.find((item) => item.id === resumeId)?.title ||
                    "简历"}
                </span>
              ),
              children: resume,
            },
          ]}
        />
      </section>
      <Modal
        title="面试设置"
        open={settingsOpen}
        onCancel={() => setSettingsOpen(false)}
        footer={[
          <Button
            key="done"
            type="primary"
            onClick={() => setSettingsOpen(false)}
          >
            完成
          </Button>,
        ]}
        width={620}
        className="interview-settings-modal"
        destroyOnClose={false}
      >
        <InterviewSettingsContent
          interviewer={interviewer}
          setInterviewer={setInterviewer}
          micTested={micTested}
          setMic={setMic}
          setMicTested={setMicTested}
          speakerTested={speakerTested}
          setSpeakerTested={setSpeakerTested}
        />
      </Modal>
    </div>
  );
}
function BulbTip() {
  return <CheckCircleOutlined />;
}
