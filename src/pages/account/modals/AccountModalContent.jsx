import React from "react";
import { Button, Form, Input } from "antd";
import { WechatOutlined } from "../../../components/icons.js";

import "../account.css";
import { phoneRules, CodeInput } from "../components/AccountFields.jsx";
export function AccountModalContent({
  modal,
  bindingForm,
  onAccountChange,
  account,
  setModal,
  message,
  deletion,
  setDeletion,
  onAuth,
}) {
  return (
    <>
      {modal === "phone" ? (
        <>
          <p className="muted">演示绑定流程，不会发送短信或修改真实账号。</p>
          <Form
            form={bindingForm}
            layout="vertical"
            onFinish={(v) => {
              onAccountChange({ ...account, phone: v.phone });
              setModal(null);
              message.success("已更新演示手机号");
            }}
          >
            <Form.Item name="phone" label="手机号" rules={phoneRules}>
              <Input placeholder="请输入手机号" maxLength={11} />
            </Form.Item>
            <Form.Item label="短信验证码">
              <CodeInput form={bindingForm} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认绑定（演示）
            </Button>
            <p className="auth-demo">演示验证码：123456</p>
          </Form>
        </>
      ) : modal === "wechat" ? (
        <div className="wechat-login">
          <WechatOutlined style={{ fontSize: 36, color: "#8b91a1" }} />
          <h3>微信绑定</h3>
          <p>当前为原型，不获取微信授权。</p>
          <Button
            type="primary"
            onClick={() => {
              onAccountChange({ ...account, wechat: true });
              setModal(null);
              message.success("微信绑定演示完成");
            }}
          >
            演示确认绑定
          </Button>
        </div>
      ) : (
        <>
          <p>
            这里只演示注销确认。输入 delete
            后，将返回登录页；不会删除任何真实账号或文件。
          </p>
          <Input
            aria-label="注销确认"
            value={deletion}
            onChange={(e) => setDeletion(e.target.value)}
            placeholder="请输入 delete"
          />
          <Button
            block
            danger
            type="primary"
            disabled={deletion !== "delete"}
            className="delete-confirm"
            onClick={() => {
              setModal(null);
              onAuth("login");
              message.info("已退出演示账户，未删除真实数据");
            }}
          >
            确认注销（演示）
          </Button>
        </>
      )}
    </>
  );
}
