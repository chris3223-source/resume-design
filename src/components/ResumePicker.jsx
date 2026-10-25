import React from "react";
import { Button, Dropdown } from "antd";
import { CheckOutlined, FileTextOutlined } from "./icons.js";

export function ResumePicker({
  items,
  selectedId,
  open,
  onOpenChange,
  onSelect,
  buttonRef,
}) {
  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      open={open}
      onOpenChange={onOpenChange}
      popupRender={() => (
        <div className="agent-resume-picker">
          <strong>我的简历</strong>
          <div className="agent-resume-picker-list">
            {items.map((item) => (
              <button
                className={`agent-resume-picker-item ${item.id === selectedId ? "selected" : ""}`}
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item);
                  onOpenChange(false);
                }}
              >
                <FileTextOutlined />
                <span>
                  <span className="agent-resume-picker-title">
                    {item.title}
                  </span>
                  <small>{item.date} · 最近更新</small>
                </span>
                {item.id === selectedId && <CheckOutlined />}
              </button>
            ))}
          </div>
        </div>
      )}
    >
      <Button
        ref={buttonRef}
        size="small"
        shape="round"
        icon={<FileTextOutlined />}
        aria-label="选择简历"
      >
        我的简历
      </Button>
    </Dropdown>
  );
}
