import { preparationQuestions } from "../../../mocks/interview.js";
import React from "react";

import { Button, Tag } from "antd";

import { ArrowRightOutlined } from "../../../components/icons.js";

export function InterviewPreparationPanel({ send }) {
  return (
    <div className="panel-scroll">
      <div className="form-card">
        <h3>
          <span />
          面试准备
        </h3>
        <p className="muted">从简历出发，准备有针对性的回答。</p>
        {preparationQuestions.map((q, i) => (
          <div className="question" key={q}>
            <Tag color="green">0{i + 1}</Tag>
            <span>{q}</span>
          </div>
        ))}
        <Button
          type="primary"
          className="panel-primary"
          onClick={() => send("请帮我准备前端技术面试")}
        >
          在对话中练习 <ArrowRightOutlined />
        </Button>
        <p className="demo-note">示例题目 · 非真实模拟面试</p>
      </div>
    </div>
  );
}
