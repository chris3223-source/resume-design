import React from "react";
import { Button, Form, Input } from "antd";
import { AimOutlined, ArrowRightOutlined } from "../../../components/icons.js";

export function JobAnalysisInlineForm({
  selectedResumeId,
  selectedResumeTitle,
  onCancel,
  onSubmit,
}) {
  return (
    <div className="job-chat-form">
      <div className="job-chat-form-heading">
        <AimOutlined />
        <div>
          <strong>新建岗位分析</strong>
          <span>当前简历：{selectedResumeTitle}</span>
        </div>
      </div>
      <Form
        layout="vertical"
        size="small"
        onFinish={(values) =>
          onSubmit({ ...values, resumeId: selectedResumeId })
        }
      >
        <Form.Item
          label="目标岗位"
          name="role"
          rules={[{ required: true, message: "请输入目标岗位" }]}
        >
          <Input placeholder="例如：前端开发工程师" />
        </Form.Item>
        <Form.Item label="目标公司（选填）" name="company">
          <Input placeholder="输入公司名称" />
        </Form.Item>
        <Form.Item label="岗位描述 JD（选填）" name="jd">
          <Input.TextArea rows={3} placeholder="粘贴岗位职责与任职要求" />
        </Form.Item>
        <div className="job-chat-form-footer">
          <span>将整理 JD 解析、简历诊断、匹配分析与面试准备</span>
          <div className="job-chat-form-actions">
            <Button onClick={onCancel}>取消</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<ArrowRightOutlined />}
            >
              生成分析
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
