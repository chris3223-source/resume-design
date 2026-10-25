import React, { useRef } from "react";
import { ConversationIndex } from "./components/ConversationIndex.jsx";
import { Workspace } from "../../components/Workspace.jsx";
import { ResumePicker } from "../../components/ResumePicker.jsx";
import { ResumeTemplatePicker } from "./components/ResumeTemplatePicker.jsx";
import { SidebarToggleButton } from "../../components/SidebarToggleButton.jsx";

import { ResumeEditor } from "../resume/ResumeEditor.jsx";

import { Button, Avatar, Tag, Splitter, Tooltip, Upload } from "antd";
import Bubble from "@ant-design/x/es/bubble/index.js";
import Sender from "@ant-design/x/es/sender/index.js";

import {
  EditOutlined,
  FileTextOutlined,
  AimOutlined,
  UserOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  ArrowLeftOutlined,
} from "../../components/icons.js";
import { PaperClipOutlined } from "@ant-design/icons";

import { roles } from "../../mocks/agent.jsx";
const labels = {
  resume: "前端开发工程师 · 简历",
  preferences: "求职偏好",
  profile: "关于我",
  jobs: "岗位匹配",
  interview: "面试准备",
};
export function AgentPage({
  editResume,
  full,
  setFull,
  sidebar,
  onExpandSidebar,
  sessions,
  session,
  newChat,
  resumeMenuOpen,
  setResumeMenuOpen,
  resumeItems,
  currentResume,
  setSelectedResume,
  open,
  editing,
  setEditing,
  templateSelecting,
  setTemplateSelecting,
  onTemplateSelect,
  updateResume,
  histories,
  send,
  value,
  setValue,
  files,
  setFiles,
  notify,
  panels,
  active,
  setActive,
  setPanels,
  content,
  openJobAnalysisInChat,
}) {
  const scrollRef = useRef(null);
  const messages = histories[session] || [];
  return (
    <Splitter>
      <Splitter.Panel
        defaultSize="48%"
        min={360}
        resizable
        style={{ display: full ? "none" : undefined }}
      >
        <div className="chat-pane">
          <div
            className="chat-header agent-conversation-header"
            style={{ display: templateSelecting ? "none" : undefined }}
          >
            <SidebarToggleButton
              expanded={sidebar}
              onExpand={onExpandSidebar}
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
            <ResumePicker
              items={resumeItems}
              selectedId={currentResume.id}
              open={resumeMenuOpen}
              onOpenChange={setResumeMenuOpen}
              onSelect={(item) => {
                setSelectedResume(item);
                open("resume");
              }}
            />
          </div>
          {templateSelecting && (
            <ResumeTemplatePicker
              doc={currentResume}
              selectedTemplateId={currentResume.templateId || "blue"}
              onSelect={onTemplateSelect}
              onBack={() => setTemplateSelecting(false)}
            />
          )}
          <div
            className="agent-editor-pane"
            style={{
              display: editing && !templateSelecting ? undefined : "none",
            }}
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
            style={{
              display: editing || templateSelecting ? "none" : undefined,
            }}
          >
            <div className="conversation-scroll-area">
              <div className="chat-scroll" ref={scrollRef}>
                {(histories[session] || []).length ? (
                  <>
                    <div className="date-label">今天</div>
                    <Bubble.List
                      items={messages.map((message) => ({
                        ...message,
                        "data-conversation-key": String(message.key),
                      }))}
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
              {!editing && !full && (
                <ConversationIndex
                  key={session}
                  messages={messages}
                  scrollRef={scrollRef}
                />
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
                AI 内容仅供参考，请确保简历信息真实准确 <span>演示数据</span>
              </div>
            </div>
          </div>
        </div>
      </Splitter.Panel>
      {panels.length > 0 && (
        <Splitter.Panel defaultSize="52%" min={420} resizable>
          <Workspace
            activeKey={active}
            onChange={setActive}
            onRemove={(key) => {
              const next = panels.filter((p) => p !== key);
              setPanels(next);
              if (active === key) setActive(next.at(-1));
              setFull(false);
            }}
            full={full}
            onToggleFull={() => setFull((p) => !p)}
            onClose={() => {
              setPanels([]);
              setFull(false);
            }}
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
                  {key === "resume" ? currentResume.title : labels[key]}
                </span>
              ),
              children: content(key),
            }))}
          />
        </Splitter.Panel>
      )}
    </Splitter>
  );
}
