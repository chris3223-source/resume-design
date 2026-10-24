import { PolicyContent } from "./modals/PolicyContent.jsx";
import React, { useState } from "react";
import { App, Button, Form, Input, Modal, QRCode, Tabs, Tag } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  FileTextOutlined,
  LockOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  UserOutlined,
  WechatOutlined,
} from "../../components/icons.js";

import "./account.css";

import {
  phoneRules,
  passwordRules,
  CodeInput,
  Agreement,
} from "./components/AccountFields.jsx";
export function AuthPage({ initialMode = "login", onSuccess, onBack }) {
  const [mode, setMode] = useState(initialMode),
    [method, setMethod] = useState("sms"),
    [policy, setPolicy] = useState(null);
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const register = mode === "register",
    reset = mode === "reset";
  function change(next) {
    form.resetFields();
    setMode(next);
    setMethod("sms");
  }
  function complete(values) {
    if (reset) {
      message.success("密码重置流程演示完成，未修改真实密码");
      change("login");
      return;
    }
    form.resetFields();
    onSuccess({
      name: values.name || "林同学",
      phone: values.phone || "",
      wechat: method === "wechat",
      method: method === "wechat" ? "微信" : "手机号",
    });
    message.success(
      register ? "演示注册完成，已进入工作台" : "已进入演示工作台",
    );
  }
  function policyModal(title) {
    setPolicy(title);
  }
  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="auth-brand">
          <span className="brand-mark">
            <ThunderboltOutlined />
          </span>
          <strong>简历工作台</strong>
        </div>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack}>
          返回预览
        </Button>
      </header>
      <main className="auth-main">
        <section className="auth-intro">
          <Tag>YOUR NEXT CHAPTER</Tag>
          <h1>
            让每一份经历，
            <br />
            走向更好的机会。
          </h1>
          <p>
            从一份好简历，到一次从容的面试。
            <br />
            把求职前的每一步，准备得更好。
          </p>
          <div className="auth-benefits">
            {[
              [
                <FileTextOutlined />,
                "让经历更有说服力",
                "梳理亮点，打磨属于你的简历",
              ],
              [
                <ThunderboltOutlined />,
                "让准备更有方向",
                "围绕目标岗位，找准改进重点",
              ],
              [
                <UserOutlined />,
                "让面试更有底气",
                "看着简历练习，把回答说清楚",
              ],
            ].map(([icon, title, desc]) => (
              <div key={title}>
                {icon}
                <div>
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="auth-intro-footer">
            <SafetyCertificateOutlined /> 你的经历，始终由你掌握
          </div>
        </section>
        <section className="auth-form-card">
          <div className="auth-form-heading">
            <span>
              {reset
                ? "ACCOUNT RECOVERY"
                : register
                  ? "CREATE YOUR ACCOUNT"
                  : "WELCOME BACK"}
            </span>
            <h2>
              {reset ? "找回密码" : register ? "创建你的账号" : "欢迎回来"}
            </h2>
            <p>
              {reset
                ? "验证手机号后，设置新的演示密码"
                : register
                  ? "为下一份机会，迈出第一步"
                  : "登录后，继续你的求职准备"}
            </p>
          </div>
          {!register && !reset && (
            <Tabs
              activeKey={method}
              onChange={(key) => {
                form.resetFields();
                setMethod(key);
              }}
              items={[
                { key: "sms", label: "验证码登录" },
                { key: "password", label: "密码登录" },
                { key: "wechat", label: "微信登录" },
              ]}
            />
          )}
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={complete}
            key={mode + method}
          >
            {method === "wechat" && !register && !reset ? (
              <div className="wechat-login">
                <QRCode
                  value="resume-workbench-prototype-only-not-a-login-token"
                  size={160}
                  color="#5b6172"
                />
                <strong>微信扫码登录</strong>
                <p>二维码仅为视觉演示，扫描无法登录</p>
                <Agreement openPolicy={policyModal} />
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  icon={<WechatOutlined />}
                >
                  演示扫码确认
                </Button>
              </div>
            ) : (
              <>
                {register && (
                  <Form.Item
                    name="name"
                    label="你的称呼"
                    rules={[
                      { required: true, message: "请输入称呼" },
                      { whitespace: true, message: "称呼不能全为空格" },
                      { max: 20, message: "称呼最多 20 字" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="怎么称呼你"
                      maxLength={20}
                    />
                  </Form.Item>
                )}
                <Form.Item name="phone" label="手机号" rules={phoneRules}>
                  <Input
                    prefix={<MobileOutlined />}
                    placeholder="请输入 11 位手机号"
                    maxLength={11}
                    autoComplete="off"
                  />
                </Form.Item>
                {(register || reset || method === "sms") && (
                  <Form.Item label="验证码" required>
                    <CodeInput form={form} />
                  </Form.Item>
                )}
                {(register || reset || method === "password") && (
                  <Form.Item
                    name="password"
                    label={reset ? "新密码" : "密码"}
                    rules={passwordRules}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder={
                        register || reset
                          ? "设置至少 8 位演示密码"
                          : "输入至少 8 位演示密码"
                      }
                      autoComplete="new-password"
                    />
                  </Form.Item>
                )}
                {method === "password" && !register && !reset && (
                  <div className="auth-forgot">
                    <Button type="link" onClick={() => change("reset")}>
                      忘记密码？
                    </Button>
                  </div>
                )}
                {!reset && <Agreement openPolicy={policyModal} />}
                <Button type="primary" htmlType="submit" size="large" block>
                  {reset ? "确认重置" : register ? "注册并进入工作台" : "登录"}{" "}
                  <ArrowRightOutlined />
                </Button>
              </>
            )}
          </Form>
          <div className="auth-switch">
            {reset ? (
              <Button type="link" onClick={() => change("login")}>
                返回登录
              </Button>
            ) : (
              <>
                {register ? "已有账号？" : "还没有账号？"}
                <Button
                  type="link"
                  onClick={() => change(register ? "login" : "register")}
                >
                  {register ? "去登录" : "立即注册"}
                </Button>
              </>
            )}
          </div>
          <div className="auth-demo">
            <span />
            原型演示 · 验证码 123456
            <br />
            <small>不创建真实账户，不发送短信，不保存密码</small>
          </div>
        </section>
      </main>
      <footer className="auth-footer">
        AI 求职简历工作台 <span>为下一份机会，做好准备</span>
      </footer>
      <Modal
        title={`${policy} · 原型占位`}
        open={!!policy}
        footer={<Button onClick={() => setPolicy(null)}>知道了</Button>}
        onCancel={() => setPolicy(null)}
      >
        <PolicyContent policy={policy} />
      </Modal>
    </div>
  );
}
