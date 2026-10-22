import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Input,
  Select,
  Tag,
  Progress,
  Modal,
} from "antd";
import {
  PhoneOutlined,
  SoundOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  UserOutlined,
  ReloadOutlined,
  BulbOutlined,
  ProjectOutlined,
  CodeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Bubble, Sender } from "@ant-design/x";
import "./interview.css";
import "./unified-call.css";

const questions = [
  "你好，林同学。我们先聊聊你简历中的「AI 求职简历工作台」：你负责了哪些模块？其中最有挑战的部分是什么？",
  "你提到了对话与工作区联动。如果 AI 回复过程中用户切换了简历，你会怎样保证内容更新到正确的简历？",
  "如果简历实时预览出现输入卡顿，你会如何定位问题？请结合你的项目说说具体思路。",
];
const examples = [
  "我主要负责简历编辑和实时预览。比较有挑战的是让表单、预览和对话修改保持一致，我把简历数据集中管理，各个视图都从同一份数据读取。",
  "我会在每个请求里带上简历 ID 和版本号，收到修改后先检查目标和版本。如果用户已切换简历，就更新对应数据，不覆盖当前正在看的简历。",
  "我会先通过性能工具确认是输入事件、组件渲染还是预览排版耗时，再考虑减少无关渲染，并把高成本的预览更新与输入分开处理。",
];
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
  resume,
  onToggleSidebar,
  sidebarOpen,
  resumes = [],
  selectedResumeId,
  onResumeChange,
}) {
  const [stage, setStage] = useState("setup");
  const [job, setJob] = useState("前端开发工程师");
  const [resumeId, setResumeId] = useState(selectedResumeId || resumes[0]?.id);
  const [kind, setKind] = useState("综合面");
  const [mic, setMic] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [interviewer, setInterviewer] = useState("女面试官");
  const [micTested, setMicTested] = useState(false);
  const [speakerTested, setSpeakerTested] = useState(false);
  const [mode, setMode] = useState("voice");
  const [muted, setMuted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("speaking");
  const [caption, setCaption] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [speaker, setSpeaker] = useState(true);
  const scrollRef = useRef(null);
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
        ? "前端开发工程师 · 模拟面试"
        : "面试复盘 · 前端开发工程师";
  return (
    <div
      className={`interview-layout ${isLive ? "interview-in-progress" : ""}`}
    >
      <section className="interview-left">
        <header className="chat-header agent-conversation-header interview-session-header">
          <Button
            aria-label={sidebarOpen ? "收起侧栏" : "展开侧栏"}
            type="text"
            size="small"
            icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            onClick={onToggleSidebar}
          />
          <div className="chat-title">
            <Button
              aria-label="重新准备面试"
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => setStage("setup")}
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
            <Button type="primary" icon={<ReloadOutlined />} onClick={start}>
              再练一轮
            </Button>
            <Button type="text" onClick={() => setStage("setup")}>
              返回面试准备
            </Button>
          </div>
        )}
      </section>
      <section className="interview-resume">
        <div className="interview-resume-header">
          <span>
            <FileTextOutlined /> 前端开发工程师 · 简历
          </span>
          <Tag>面试参考 · 只读</Tag>
        </div>
        {resume}
      </section>
      <Modal
        title="面试设置"
        open={settingsOpen}
        onCancel={() => setSettingsOpen(false)}
        footer={[
          <Button key="done" type="primary" onClick={() => setSettingsOpen(false)}>
            完成
          </Button>,
        ]}
        width={620}
        className="interview-settings-modal"
        destroyOnClose={false}
      >
        <div className="interview-setting-section">
          <label>语言</label>
          <div className="interview-setting-options" role="group" aria-label="面试语言">
            <Button type="primary" aria-pressed="true">中文</Button>
          </div>
        </div>
        <div className="interview-setting-section">
          <label>面试官</label>
          <div className="interview-setting-options" role="group" aria-label="选择面试官">
            {["女面试官", "男面试官"].map((option) => (
              <Button
                key={option}
                type={interviewer === option ? "primary" : "default"}
                aria-pressed={interviewer === option}
                icon={<SoundOutlined />}
                onClick={() => setInterviewer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        <div className="interview-credit-note">
          本场模拟面试需消耗 300 积分（仅原型展示，不会真实扣分）。
        </div>
        <div className="interview-setting-section">
          <label>设备检测</label>
          <div className="interview-device-grid">
            <div className="interview-device-card">
              <div className="interview-device-heading">
                <span className="interview-device-icon"><AudioOutlined /></span>
                <div><strong>麦克风</strong><small>{micTested ? "测试完成" : "测试你的语音输入"}</small></div>
                <Button size="small" onClick={() => { setMic(true); setMicTested(true); }}>开始测试</Button>
              </div>
              <div className={`interview-mic-meter ${micTested ? "tested" : ""}`} aria-hidden="true">
                {Array.from({ length: 18 }, (_, i) => <i key={i} />)}
              </div>
            </div>
            <div className="interview-device-card">
              <div className="interview-device-heading">
                <span className="interview-device-icon"><SoundOutlined /></span>
                <div><strong>扬声器</strong><small>{speakerTested ? "测试完成" : "确认扬声器可用"}</small></div>
                <Button size="small" onClick={() => setSpeakerTested(true)}>{speakerTested ? "重新测试" : "播放测试音"}</Button>
              </div>
              <p>播放一段面试官的声音，确认扬声器可用。</p>
            </div>
          </div>
          <small className="interview-device-disclaimer">设备测试为交互演示，不会访问麦克风或播放真实音频。</small>
        </div>
      </Modal>
    </div>
  );
}
function BulbTip() {
  return <CheckCircleOutlined />;
}
