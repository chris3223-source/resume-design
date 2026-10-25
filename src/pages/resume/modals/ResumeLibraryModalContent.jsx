import React from "react";
import { Button, Form, Input, Radio } from "antd";

import "../resume-library.css";

export function ResumeLibraryModalContent({ dialog, finish }) {
  return (
    <>
      {dialog && (
        <Form
          key={dialog.type + (dialog.item?.id || "")}
          layout="vertical"
          initialValues={{
            title: dialog.item?.title || "我的新简历",
            stage: "应届生",
          }}
          onFinish={finish}
          preserve={false}
        >
          <Form.Item
            label="简历名称"
            name="title"
            rules={[
              { required: true, message: "请输入名称" },
              { whitespace: true, message: "名称不能为空" },
              { max: 40, message: "名称最多 40 字" },
            ]}
          >
            <Input maxLength={40} />
          </Form.Item>
          {dialog.type === "new" && (
            <Form.Item label="求职阶段" name="stage">
              <Radio.Group options={["在校生", "应届生", "已工作"]} />
            </Form.Item>
          )}
          <Button type="primary" htmlType="submit" block>
            {dialog.type === "rename" ? "保存名称" : "创建简历"}
          </Button>
          <p className="library-modal-note">
            仅在本次演示中生效，不写入真实简历库。
          </p>
        </Form>
      )}
    </>
  );
}
