import React from "react";
import { ConfigProvider, App as AntApp } from "antd";
import { Application } from "./app/Application.jsx";
export function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1e4aff",
          colorLink: "#1e4aff",
          colorLinkHover: "#5272ff",
          colorLinkActive: "#173ddd",
          colorInfo: "#1e4aff",
          colorText: "#111213",
          colorTextSecondary: "#5b6172",
          colorTextTertiary: "#8b91a1",
          colorBorder: "#e5e5e5",
          colorBgBase: "#ffffff",
          colorBgContainer: "#ffffff",
          colorBgLayout: "#f7f8fb",
          borderRadius: 8,
          fontSize: 13,
          fontFamily:
            '"IBM Plex Sans", "Microsoft YaHei", -apple-system, sans-serif',
        },
        components: {
          Tabs: { cardBg: "#ffffff" },
          Radio: { buttonBg: "#ffffff" },
        },
      }}
    >
      <AntApp>
        <Application />
      </AntApp>
    </ConfigProvider>
  );
}
