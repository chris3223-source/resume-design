import { JobAnalysisModalContent } from "./JobAnalysisModalContent.jsx";
import React from "react";
import { Modal } from "antd";

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
      <JobAnalysisModalContent
        open={open}
        selectedResumeId={selectedResumeId}
        onSubmit={onSubmit}
        resumes={resumes}
        onCancel={onCancel}
      />
    </Modal>
  );
}
