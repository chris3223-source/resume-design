import { AccountModalContent } from "./modals/AccountModalContent.jsx";
import React, { useState } from "react";
import {
  App,
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Segmented,
  Switch,
  Tag,
} from "antd";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  LockOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  WechatOutlined,
} from "../../components/icons.js";
import {
  CrownOutlined,
  DesktopOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import "./account.css";

export function AccountSettings({ account, onAccountChange, onAuth }) {
  const { message } = App.useApp();
  const [form] = Form.useForm(),
    [bindingForm] = Form.useForm();
  const [memory, setMemory] = useState(false),
    [modal, setModal] = useState(null),
    [deletion, setDeletion] = useState("");
  const masked = account.phone
    ? `${account.phone.slice(0, 3)} **** ${account.phone.slice(-4)}`
    : "未绑定";
  return (
    <div className="settings-scroll">
      <div className="settings-title">
        <div>
          <h1>账户设置</h1>
          <p>管理你的账号信息和个人偏好设置</p>
        </div>
        <Tag>演示账户</Tag>
      </div>
      <div className="settings-content">
        <section className="settings-card">
          <div className="settings-card-heading">
            <h2>账户概览</h2>
            <Tag icon={<CrownOutlined />}>基础版</Tag>
          </div>
          <div className="account-overview">
            <div>
              <Avatar
                size={48}
                style={{ background: "#f4f6ff", color: "#1e4aff" }}
              >
                {account.name.slice(0, 1)}
              </Avatar>
              <div>
                <strong>{account.name}</strong>
                <small>每一次准备，都是新的开始</small>
              </div>
            </div>
            <div>
              <span>当前方案</span>
              <strong>免费体验</strong>
            </div>
            <div>
              <span>账号状态</span>
              <strong className="account-ok">
                <CheckCircleOutlined /> 正常 · 演示
              </strong>
            </div>
          </div>
        </section>
        <section className="settings-card">
          <div className="settings-card-heading">
            <h2>账号信息</h2>
            <Button type="text" size="small" onClick={() => onAuth("login")}>
              预览登录 / 注册 <ArrowRightOutlined />
            </Button>
          </div>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ name: account.name }}
            onFinish={(v) => {
              onAccountChange({ ...account, name: v.name });
              message.success("资料已在本次原型中更新");
            }}
          >
            <div className="settings-form-grid">
              <Form.Item
                name="name"
                label="用户名"
                rules={[
                  { required: true, message: "请输入用户名" },
                  { whitespace: true, message: "用户名不能全为空格" },
                  { max: 20, message: "最多 20 字" },
                ]}
              >
                <Input maxLength={20} />
              </Form.Item>
              <Form.Item label="用户 ID">
                <Input
                  readOnly
                  value="demo_user_2026"
                  suffix={<Tag>演示</Tag>}
                />
              </Form.Item>
              <Form.Item label="注册方式">
                <Input readOnly value={account.method} />
              </Form.Item>
              <Form.Item className="profile-save">
                <Button htmlType="submit">保存资料</Button>
              </Form.Item>
            </div>
          </Form>
          <h3 className="settings-subheading">
            <SafetyCertificateOutlined /> 账号绑定
          </h3>
          <div className="binding-grid">
            <div className="binding-item">
              <div>
                <MobileOutlined />
                <strong>手机号</strong>
                <Button size="small" onClick={() => setModal("phone")}>
                  {account.phone ? "更换" : "绑定"}
                </Button>
              </div>
              <p>{masked}</p>
              <small>用于登录和找回账号</small>
            </div>
            <div className="binding-item">
              <div>
                <WechatOutlined />
                <strong>微信</strong>
                <Button size="small" onClick={() => setModal("wechat")}>
                  {account.wechat ? "查看" : "绑定"}
                </Button>
              </div>
              <p>{account.wechat ? "已绑定 · 演示" : "未绑定"}</p>
              <small>可使用微信快捷登录</small>
            </div>
          </div>
          <div className="password-setting">
            <span>
              <LockOutlined /> 登录密码 <small>演示密码不会保存</small>
            </span>
            <Button size="small" onClick={() => onAuth("reset")}>
              设置 / 修改
            </Button>
          </div>
        </section>
        <section className="settings-card settings-preference">
          <div className="preference-copy">
            <span className="preference-icon">
              <SunOutlined />
            </span>
            <div>
              <h2>主题</h2>
              <p>简洁清晰，专注你的求职准备</p>
            </div>
          </div>
          <Segmented
            value="浅色"
            options={[
              { value: "浅色", label: "浅色", icon: <SunOutlined /> },
              {
                value: "深色",
                label: "深色",
                icon: <MoonOutlined />,
                disabled: true,
              },
              {
                value: "系统",
                label: "系统",
                icon: <DesktopOutlined />,
                disabled: true,
              },
            ]}
          />
          <small className="theme-note">原型暂提供浅色主题</small>
        </section>
        <section className="settings-card settings-preference">
          <div className="preference-copy">
            <span className="preference-icon">
              <ThunderboltOutlined />
            </span>
            <div>
              <h2>Agent 设置</h2>
              <p>自动记住我主动提供的求职偏好</p>
            </div>
          </div>
          <Switch
            aria-label="自动记住偏好"
            checked={memory}
            onChange={setMemory}
          />
          <small className="theme-note">仅保留本次演示状态，不上传数据</small>
        </section>
        <section className="settings-card session-card">
          <div>
            <h2>登录与安全</h2>
            <p>当前为本地演示会话，刷新后重置</p>
          </div>
          <Button icon={<LogoutOutlined />} onClick={() => onAuth("login")}>
            退出登录
          </Button>
        </section>
        <div className="settings-danger">
          <span>不再使用这个账号？</span>
          <Button
            type="link"
            onClick={() => {
              setDeletion("");
              setModal("delete");
            }}
          >
            注销账号
          </Button>
        </div>
      </div>
      <Modal
        title={
          modal === "phone"
            ? "绑定手机号"
            : modal === "wechat"
              ? "绑定微信"
              : "注销演示账号"
        }
        open={!!modal}
        onCancel={() => setModal(null)}
        afterOpenChange={(open) => {
          if (open && modal === "phone") bindingForm.resetFields();
        }}
        footer={null}
        destroyOnHidden
      >
        <AccountModalContent
          modal={modal}
          bindingForm={bindingForm}
          onAccountChange={onAccountChange}
          account={account}
          setModal={setModal}
          message={message}
          deletion={deletion}
          setDeletion={setDeletion}
          onAuth={onAuth}
        />
      </Modal>
    </div>
  );
}
