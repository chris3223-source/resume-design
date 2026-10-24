import React, { useState } from "react";
import { Button, Tabs } from "antd";
import {
  AimOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "../../components/icons.js";

import { resumeFields } from "../resume/ResumeEditor.jsx";

import { JobDescription } from "./tabs/JobDescription.jsx";
import { ResumeDiagnosis } from "./tabs/ResumeDiagnosis.jsx";
import { MatchingAnalysis } from "./tabs/MatchingAnalysis.jsx";
import { ExperienceFollowup } from "./tabs/ExperienceFollowup.jsx";
import { ResumeOptimization } from "./tabs/ResumeOptimization.jsx";
import { InterviewPreparation } from "./tabs/InterviewPreparation.jsx";
const reportTabs = [
  ["jd", "JD 解析"],
  ["diagnosis", "简历诊断"],
  ["matching", "匹配分析"],
  ["followup", "经历追问"],
  ["optimization", "简历优化"],
  ["interview", "面试准备"],
];

export function JobAnalysisPage({
  analyses,
  selectedAnalysisId,
  onBack,
  onCreate,
  resumes,
}) {
  const [activeTab, setActiveTab] = useState("jd");
  const activeTabKey = reportTabs.some(([key]) => key === activeTab)
    ? activeTab
    : "jd";
  const selected = selectedAnalysisId
    ? analyses.find((item) => item.id === selectedAnalysisId)
    : null;
  const resume = resumes.find((item) => item.id === selected?.resumeId);
  const data = resume ? resumeFields(resume) : {};

  if (!selected) {
    return (
      <div className="job-analysis-empty-page">
        <div className="job-report-welcome-icon">
          <AimOutlined />
        </div>
        <h1>岗位匹配</h1>
        <p>
          选择简历并填写目标岗位，分析完成后可在这里查看 JD
          解析、简历诊断和求职准备。
        </p>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          新建岗位分析
        </Button>
        <div className="job-report-workflow">
          {reportTabs.map(([key, label], index) => (
            <React.Fragment key={key}>
              {index > 0 && (
                <span className="job-report-workflow-arrow">→</span>
              )}
              <span>{label}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      key: "jd",
      label: "JD 解析",
      children: <JobDescription />,
    },
    {
      key: "diagnosis",
      label: "简历诊断",
      children: <ResumeDiagnosis analysis={selected} data={data} />,
    },
    {
      key: "matching",
      label: "匹配分析",
      children: <MatchingAnalysis />,
    },
    {
      key: "followup",
      label: "经历追问",
      children: <ExperienceFollowup analysis={selected} data={data} />,
    },
    {
      key: "optimization",
      label: "简历优化",
      children: <ResumeOptimization />,
    },
    {
      key: "interview",
      label: "面试准备",
      children: <InterviewPreparation analysis={selected} data={data} />,
    },
  ];

  return (
    <div className="job-analysis-workspace">
      {selected.status === "processing" && (
        <div className="job-workspace-processing">
          演示工作流处理中 · 未调用 AI 或岗位分析服务
          <span />
        </div>
      )}
      <Tabs
        className="job-report-tabs"
        activeKey={activeTabKey}
        onChange={setActiveTab}
        renderTabBar={(props, DefaultTabBar) => (
          <div className="job-report-navigation">
            <Button
              aria-label="返回岗位匹配"
              title="返回岗位匹配"
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                setActiveTab("jd");
                onBack?.();
              }}
            />
            <DefaultTabBar {...props} />
          </div>
        )}
        items={tabItems}
      />
    </div>
  );
}
