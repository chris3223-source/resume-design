import React from "react";
import { Button } from "antd";
import { MenuUnfoldOutlined } from "./icons.js";

export function SidebarToggleButton({ expanded, onExpand }) {
  if (expanded) return null;

  return (
    <Button
      aria-label="展开侧栏"
      title="展开侧栏"
      className="sidebar-toggle-button"
      type="text"
      size="small"
      icon={<MenuUnfoldOutlined />}
      onClick={onExpand}
    />
  );
}
