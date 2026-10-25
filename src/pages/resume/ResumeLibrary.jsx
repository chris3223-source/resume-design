import { ResumeLibraryModalContent } from "./modals/ResumeLibraryModalContent.jsx";
import React, { useState } from "react";
import { App, Button, Modal, Popconfirm, Tag, Tooltip } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
} from "../../components/icons.js";
import { EyeOutlined, CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import "./resume-library.css";

import { ResumeLibraryEmpty } from "./ResumeLibraryEmpty.jsx";
import { ResumeImportModal } from "./modals/ResumeImportModal.jsx";
import { useResumeImportFlow } from "./useResumeImportFlow.js";

export function ResumeLibrary({
  items,
  onItemsChange,
  onEdit,
  renderResume,
  onAiCreate,
  onPreview,
}) {
  const { message } = App.useApp();
  const [emptyPreview, setEmptyPreview] = useState(false);
  const isEmpty = emptyPreview || items.length === 0;
  const [dialog, setDialog] = useState(null);
  const importFlow = useResumeImportFlow((doc) => {
    onItemsChange([doc, ...items]);
    setEmptyPreview(false);
  });
  function openNew() {
    setDialog({ type: "new" });
  }
  function finish(values) {
    if (dialog.type === "rename") {
      onItemsChange(
        items.map((r) =>
          r.id === dialog.item.id ? { ...r, title: values.title } : r,
        ),
      );
      message.success("名称已更新");
    } else {
      const doc = {
        id: `resume-${Date.now()}`,
        title: values.title,
        date: "2026/10/22",
        stage: values.stage,
        blank: true,
      };
      onItemsChange([doc, ...items]);
      message.success("已新建演示简历，可从卡片继续打开");
    }
    setDialog(null);
    setEmptyPreview(false);
  }
  return (
    <div className={`library-scroll ${isEmpty ? "library-is-empty" : ""}`}>
      <div className="library-inner">
        <header className="library-header">
          <div>
            <h1>我的简历</h1>
            <span>
              {isEmpty
                ? "管理和创建你的专业简历"
                : "演示简历 · 本次修改刷新后重置"}
            </span>
          </div>
          <div>
            <Button
              type="text"
              className="empty-state-toggle"
              onClick={() => setEmptyPreview((p) => !p)}
            >
              {emptyPreview ? "返回简历列表" : "预览空状态"}
            </Button>
            {!isEmpty && (
              <>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openNew}
                >
                  新建简历
                </Button>
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => {
                    importFlow.show();
                  }}
                >
                  导入简历 <Tag>AI</Tag>
                </Button>
              </>
            )}
          </div>
        </header>
        {!isEmpty ? (
          <div className="resume-grid">
            {items.map((doc) => (
              <article className="library-card" key={doc.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPreview(doc);
                    }
                  }}
                  className="resume-thumbnail"
                  aria-label={`预览 ${doc.title}`}
                  onClick={() => onPreview(doc)}
                >
                  <div className="miniature-resume" inert={true}>
                    {renderResume(doc)}
                  </div>
                  <span className="page-badge">1 页</span>
                </div>
                <div className="library-card-title">
                  <h2 title={doc.title}>{doc.title}</h2>
                  <Tag className={doc.stage === "资深" ? "experienced" : ""}>
                    {doc.stage}
                  </Tag>
                </div>
                <p className="library-date">最近更新 {doc.date} · standard</p>
                <div className="library-card-actions">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(doc)}
                  >
                    继续编辑
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => onPreview(doc)}
                  >
                    预览
                  </Button>
                  <Tooltip title="重命名">
                    <Button
                      type="text"
                      size="small"
                      aria-label={`重命名 ${doc.title}`}
                      icon={<EditOutlined />}
                      onClick={() => setDialog({ type: "rename", item: doc })}
                    />
                  </Tooltip>
                  <Tooltip title="复制">
                    <Button
                      type="text"
                      size="small"
                      aria-label={`复制 ${doc.title}`}
                      icon={<CopyOutlined />}
                      onClick={() => {
                        onItemsChange([
                          ...items,
                          {
                            ...doc,
                            id: `resume-${Date.now()}`,
                            title: `${doc.title}（副本）`,
                            date: "2026/10/22",
                          },
                        ]);
                        message.success("已复制演示简历");
                      }}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="删除这份演示简历？"
                    description="只影响当前原型，刷新后恢复。"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={() => {
                      onItemsChange(items.filter((r) => r.id !== doc.id));
                      message.success("已从当前演示列表移除");
                    }}
                  >
                    <Tooltip title="删除">
                      <Button
                        type="text"
                        size="small"
                        danger
                        aria-label={`删除 ${doc.title}`}
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </Popconfirm>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <ResumeLibraryEmpty
            onAiCreate={onAiCreate}
            onImport={() => {
              importFlow.show();
            }}
            onBlank={openNew}
          />
        )}
      </div>
      <Modal
        title={dialog?.type === "rename" ? "重命名简历" : "新建简历"}
        open={!!dialog}
        onCancel={() => setDialog(null)}
        footer={null}
        destroyOnHidden
      >
        <ResumeLibraryModalContent dialog={dialog} finish={finish} />
      </Modal>
      <ResumeImportModal flow={importFlow} onEdit={onEdit} />
    </div>
  );
}
