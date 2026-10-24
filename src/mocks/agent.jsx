import React from "react";

import { Avatar } from "antd";

import { BulbOutlined, ThunderboltOutlined } from "../components/icons.js";

// 原型演示数据：本地静态消息，未连接 AI 服务。
export const roles = {
  user: { placement: "end", variant: "filled", shape: "round" },
  assistant: {
    placement: "start",
    variant: "borderless",
    avatar: <Avatar className="ai-avatar" icon={<ThunderboltOutlined />} />,
  },
};
export const initial = [
  {
    key: "u1",
    role: "user",
    content: "我想应聘前端开发工程师，帮我看看这份简历怎么优化。",
  },
  {
    key: "a1",
    role: "assistant",
    content: (
      <div>
        <p>
          好的，我会结合你的求职目标，从
          <strong>内容表达、项目亮点和岗位匹配</strong>三个方面帮你完善简历。
        </p>
        <p>已为你打开右侧简历。我们可以先从项目经历开始，让你的贡献更清晰。</p>
        <div className="suggestion">
          <BulbOutlined />
          <span>
            建议把「参与项目开发」改为「负责的模块 + 采取的行动 +
            可验证的结果」。
          </span>
        </div>
        <small className="demo-note">演示回复 · 未连接 AI 服务</small>
      </div>
    ),
  },
];

export const initialSessions = [
  { key: "1", label: "优化前端开发工程师简历" },
  { key: "2", label: "帮我从零创建一份简历" },
  { key: "3", label: "准备一场前端技术面试" },
];
