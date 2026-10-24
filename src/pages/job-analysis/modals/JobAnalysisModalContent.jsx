import React from "react";
import { Button, Form, Input, Select } from "antd";
import {
  ArrowRightOutlined,
  FileTextOutlined,
} from "../../../components/icons.js";

export function JobAnalysisModalContent({
  open,
  selectedResumeId,
  onSubmit,
  resumes,
  onCancel,
}) {
  return (
    <>
      <p className="muted job-form-intro">
        选择一份简历并填写目标岗位信息，查看 JD 解析、简历诊断和后续准备建议。
      </p>
      <Form
        key={open ? selectedResumeId : "closed"}
        layout="vertical"
        initialValues={{ resumeId: selectedResumeId }}
        onFinish={onSubmit}
      >
        <Form.Item
          label="分析简历"
          name="resumeId"
          rules={[{ required: true }]}
        >
          <Select
            options={resumes.map((resume) => ({
              value: resume.id,
              label: resume.title,
            }))}
            optionRender={(option) => (
              <span className="job-resume-option">
                <FileTextOutlined /> {option.label}
              </span>
            )}
          />
        </Form.Item>
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
          <Input.TextArea
            rows={5}
            placeholder="粘贴岗位职责与任职要求，便于演示 JD 解析结果"
          />
        </Form.Item>
        <div className="job-form-note">
          <span>六个报告页面</span>
          <span>
            JD 解析 · 简历诊断 · 匹配分析 · 经历追问 · 简历优化 · 面试准备
          </span>
        </div>
        <div className="job-form-actions">
          <Button onClick={onCancel}>取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<ArrowRightOutlined />}
          >
            生成演示报告
          </Button>
        </div>
      </Form>
    </>
  );
}
