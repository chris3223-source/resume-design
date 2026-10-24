import React from "react";
import { Form, Input } from "antd";

import "../about-me.css";
export function ProfileFormContent({ form, saveProfile }) {
  return (
    <>
      <Form form={form} layout="vertical" onFinish={saveProfile}>
        <Form.Item label="称呼" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="求职意向" name="job">
          <Input />
        </Form.Item>
        <Form.Item label="个人背景" name="summary">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </>
  );
}
