import React from "react";
import { Modal } from "antd";
import { DownloadOutlined, CloseOutlined } from "../../../components/icons.js";
import { ResumeImport } from "./ResumeImport.jsx";
import { ResumeImportProgress } from "./ResumeImportProgress.jsx";
import { ResumeImportCloseConfirm } from "./ResumeImportCloseConfirm.jsx";
import "../resume-import.css";

export function ResumeImportModal({ flow, onEdit }) {
  const progress =
    flow.task && ["running", "succeeded", "failed"].includes(flow.task.status);
  return (
    <>
      <Modal
        title={
          <span className="import-modal-title">
            <span>
              <DownloadOutlined />
            </span>
            {progress ? "简历整理" : "导入简历"}
          </span>
        }
        className="resume-import-modal"
        closeIcon={<CloseOutlined />}
        open={flow.open}
        onCancel={flow.requestClose}
        footer={null}
        destroyOnHidden
      >
        {progress && (
          <ResumeImportProgress
            task={flow.task}
            onClose={flow.requestClose}
            onRetry={flow.retry}
            onEdit={(doc) => {
              flow.confirmClose();
              onEdit(doc);
            }}
          />
        )}
        <div hidden={!!progress}>
          <ResumeImport
            busy={flow.busy}
            onSubmit={flow.start}
            submitError={flow.task?.status === "submit-failed"}
          />
        </div>
      </Modal>
      <ResumeImportCloseConfirm
        open={flow.closeConfirm}
        onCancel={flow.cancelClose}
        onConfirm={flow.confirmClose}
      />
    </>
  );
}
