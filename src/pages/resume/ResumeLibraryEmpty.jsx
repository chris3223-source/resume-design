import React from "react";
import "./resume-empty.css";
import {
  CodeOutlined,
  DownloadOutlined,
  PlusOutlined,
  RightOutlined,
  StarOutlined,
} from "../../components/icons.js";

export function ResumeLibraryEmpty({ onAiCreate, onImport, onBlank }) {
  return (
    <section className="library-empty">
      <div className="library-empty-symbol">
        <StarOutlined />
      </div>
      <h2>来吧，一起创建你的第一份简历</h2>
      <p>使用 AI 智能创建简历，或导入已有简历进行优化</p>
      <div className="library-empty-actions">
        <button className="empty-ai-action" onClick={onAiCreate}>
          <span className="empty-ai-icon">
            <CodeOutlined />
          </span>
          <span>
            <strong>AI 智能创建</strong>
            <small>专业简历 Agent 帮你梳理经历，创建一份专业简历</small>
          </span>
          <span className="empty-action-arrow">
            <RightOutlined />
          </span>
        </button>
        <button className="empty-secondary-action" onClick={onImport}>
          <span className="empty-secondary-icon">
            <DownloadOutlined />
          </span>
          <strong>导入现有简历</strong>
          <small>支持导入多种格式文件，轻松编辑优化</small>
        </button>
        <button className="empty-secondary-action" onClick={onBlank}>
          <span className="empty-secondary-icon">
            <PlusOutlined />
          </span>
          <strong>创建空白简历</strong>
          <small>从空白开始，自由编辑打造专属简历</small>
        </button>
      </div>
    </section>
  );
}
