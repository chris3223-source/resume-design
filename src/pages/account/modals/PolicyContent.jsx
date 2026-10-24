import React from "react";

import "../account.css";

export function PolicyContent({ policy }) {
  return (
    <>
      <p>这里用于展示{policy}的阅读入口。正式协议内容将在产品上线前补齐。</p>
      <p className="muted">当前是界面演示，勾选不会建立真实服务关系。</p>
    </>
  );
}
