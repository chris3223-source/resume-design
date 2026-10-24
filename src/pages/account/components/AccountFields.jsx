import React, { useEffect, useState } from "react";
import { App, Button, Checkbox, Form, Input } from "antd";

import "../account.css";

export const phoneRules = [
  { required: true, message: "请输入手机号" },
  { pattern: /^1\d{10}$/, message: "请输入 11 位手机号" },
];
export const codeRules = [
  { required: true, message: "请输入演示验证码" },
  {
    validator: (_, v) =>
      !v || v === "123456"
        ? Promise.resolve()
        : Promise.reject(new Error("演示验证码为 123456")),
  },
];
export const passwordRules = [
  { required: true, message: "请设置演示密码" },
  { min: 8, message: "密码至少 8 位" },
];

export function CodeInput({ form }) {
  const [seconds, setSeconds] = useState(0);
  const { message } = App.useApp();
  useEffect(() => {
    if (!seconds) return;
    const id = setTimeout(() => setSeconds((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);
  return (
    <div className="verification-row">
      <Form.Item name="code" rules={codeRules} noStyle>
        <Input autoComplete="off" placeholder="6 位演示验证码" maxLength={6} />
      </Form.Item>
      <Button
        disabled={seconds > 0}
        onClick={async () => {
          try {
            await form.validateFields(["phone"]);
            setSeconds(30);
            message.info("未发送短信，演示验证码：123456");
          } catch {}
        }}
      >
        {seconds ? `${seconds}s 后重试` : "获取验证码"}
      </Button>
    </div>
  );
}
export function Agreement({ openPolicy }) {
  return (
    <Form.Item
      name="agree"
      valuePropName="checked"
      rules={[
        {
          validator: (_, v) =>
            v
              ? Promise.resolve()
              : Promise.reject(new Error("请先勾选演示协议选项")),
        },
      ]}
    >
      <Checkbox>
        <span className="agreement-copy">
          我已阅读并同意{" "}
          <button type="button" onClick={() => openPolicy("用户协议")}>
            用户协议
          </button>{" "}
          和{" "}
          <button type="button" onClick={() => openPolicy("隐私政策")}>
            隐私政策
          </button>
        </span>
      </Checkbox>
    </Form.Item>
  );
}
