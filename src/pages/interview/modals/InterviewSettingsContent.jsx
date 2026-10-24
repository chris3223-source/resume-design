import React from "react";
import { Button } from "antd";
import { SoundOutlined, AudioOutlined } from "../../../components/icons.js";

import "../interview.css";
import "../unified-call.css";

export function InterviewSettingsContent({
  interviewer,
  setInterviewer,
  micTested,
  setMic,
  setMicTested,
  speakerTested,
  setSpeakerTested,
}) {
  return (
    <>
      <div className="interview-setting-section">
        <label>语言</label>
        <div
          className="interview-setting-options"
          role="group"
          aria-label="面试语言"
        >
          <Button type="primary" aria-pressed="true">
            中文
          </Button>
        </div>
      </div>
      <div className="interview-setting-section">
        <label>面试官</label>
        <div
          className="interview-setting-options"
          role="group"
          aria-label="选择面试官"
        >
          {["女面试官", "男面试官"].map((option) => (
            <Button
              key={option}
              type={interviewer === option ? "primary" : "default"}
              aria-pressed={interviewer === option}
              icon={<SoundOutlined />}
              onClick={() => setInterviewer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div className="interview-credit-note">
        本场模拟面试需消耗 300 积分（仅原型展示，不会真实扣分）。
      </div>
      <div className="interview-setting-section">
        <label>设备检测</label>
        <div className="interview-device-grid">
          <div className="interview-device-card">
            <div className="interview-device-heading">
              <span className="interview-device-icon">
                <AudioOutlined />
              </span>
              <div>
                <strong>麦克风</strong>
                <small>{micTested ? "测试完成" : "测试你的语音输入"}</small>
              </div>
              <Button
                size="small"
                onClick={() => {
                  setMic(true);
                  setMicTested(true);
                }}
              >
                开始测试
              </Button>
            </div>
            <div
              className={`interview-mic-meter ${micTested ? "tested" : ""}`}
              aria-hidden="true"
            >
              {Array.from({ length: 18 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
          </div>
          <div className="interview-device-card">
            <div className="interview-device-heading">
              <span className="interview-device-icon">
                <SoundOutlined />
              </span>
              <div>
                <strong>扬声器</strong>
                <small>{speakerTested ? "测试完成" : "确认扬声器可用"}</small>
              </div>
              <Button size="small" onClick={() => setSpeakerTested(true)}>
                {speakerTested ? "重新测试" : "播放测试音"}
              </Button>
            </div>
            <p>播放一段面试官的声音，确认扬声器可用。</p>
          </div>
        </div>
        <small className="interview-device-disclaimer">
          设备测试为交互演示，不会访问麦克风或播放真实音频。
        </small>
      </div>
    </>
  );
}
