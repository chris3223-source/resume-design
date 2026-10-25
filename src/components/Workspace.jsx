import React from "react";
import { Button, Tabs } from "antd";
import { CloseOutlined } from "./icons.js";
import { CompressOutlined, ExpandOutlined } from "@ant-design/icons";

export function Workspace({
  items,
  activeKey,
  onChange,
  onRemove,
  onClose,
  full,
  onToggleFull,
}) {
  const page = items[0];
  if (!page) return null;

  return (
    <div className="workspace">
      <Tabs
        type="editable-card"
        hideAdd
        activeKey={page.key || activeKey}
        onChange={onChange}
        onEdit={(key, action) => {
          if (action === "remove") onRemove(key);
        }}
        tabBarExtraContent={
          <div className="workspace-actions">
            <Button
              size="small"
              aria-label="全屏工作区"
              type="text"
              icon={full ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={onToggleFull}
            />
            <Button
              size="small"
              aria-label="关闭工作区"
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
            />
          </div>
        }
        items={[page]}
      />
    </div>
  );
}
