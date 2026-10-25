import React from "react";
import { Modal } from "antd";

export function ResumeImportCloseConfirm({ open, onCancel, onConfirm }) {
  return (
    <Modal
      title="关闭导入窗口？"
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="关闭窗口"
      cancelText="继续等待"
      width={420}
    >
      <p className="import-close-copy">
        整理演示仍在进行，关闭窗口后会在当前页面继续。你可以稍后重新打开，或在简历列表查看演示结果。
      </p>
      <p className="import-demo-note">
        仅当前页面内的模拟流程，离开页面或刷新后重置；没有真实后台任务。
      </p>
    </Modal>
  );
}
