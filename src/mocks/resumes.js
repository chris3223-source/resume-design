// 原型简历数据：仅本地示例，不读写真实简历库。
export const exampleResumes = [
  {
    id: "resume-1",
    title: "林同学的简历",
    date: "2026/10/22",
    stage: "应届生",
    blank: false,
    templateId: "blue",
  },
  {
    id: "resume-2",
    title: "前端开发 · 校招简历",
    date: "2026/10/20",
    stage: "应届生",
    blank: false,
    templateId: "blue",
  },
  {
    id: "resume-3",
    title: "林同学 · 实习简历",
    date: "2026/10/08",
    stage: "应届生",
    blank: false,
    templateId: "blue",
  },
  {
    id: "resume-4",
    title: "前端开发 · 社招简历",
    date: "2026/09/25",
    stage: "资深",
    blank: false,
    templateId: "blue",
  },
];

export const example = {
  name: "林同学",
  job: "前端开发工程师",
  phone: "138-0000-0000",
  email: "lin@example.com",
  city: "杭州",
  summary:
    "计算机科学与技术专业，熟悉 React、TypeScript 及现代前端工程化。注重用户体验与代码质量，具备独立完成 Web 应用开发的能力。",
  school: "某某大学",
  major: "计算机科学与技术 · 本科",
  educationDates: "2022.09 — 2026.06",
  educationDescription: "主修课程：数据结构、计算机网络、操作系统、数据库原理",
  projectName: "AI 求职简历工作台",
  projectDates: "2025.09 — 至今",
  projectTech: "React / TypeScript / Ant Design / Node.js",
  projectDescription:
    "面向求职者的简历编辑与岗位匹配工具，支持在线编辑、实时预览及简历导出。",
  projectBullets:
    "负责简历编辑器与实时预览模块，设计可复用的表单与简历区块。\n实现对话与工作区联动，支持多标签切换和可调整的分栏布局。\n通过按需加载和组件拆分优化页面体验，持续关注可访问性。",
  secondName: "校园活动管理平台",
  secondDates: "2025.03 — 2025.06",
  secondTech: "Vue 3 / Vite / REST API",
  secondBullets:
    "完成活动列表、搜索筛选与活动详情页面，适配桌面及移动端。\n封装请求与异常提示，统一加载、空数据和服务不可用状态。",
  skills:
    "熟悉 HTML、CSS、JavaScript，能够使用 TypeScript 开发。\n熟悉 React Hooks、组件化设计与常见性能优化。\n掌握 Git 协作流程，了解 Node.js 与数据库基础。",
  extra: "英语 CET-6 · 持续学习，乐于沟通与协作",
};

export const profileScoreParts = [
  {
    title: "教育背景",
    weight: 20,
    score: 74,
    color: "#3f67f5",
    text: "学历与专业基础",
  },
  {
    title: "经历质量",
    weight: 40,
    score: 70,
    color: "#20a36b",
    text: "项目职责与成果",
  },
  {
    title: "结构信号",
    weight: 30,
    score: 70,
    color: "#8b7cf6",
    text: "经历主线与成长",
  },
  {
    title: "AI 能力",
    weight: 10,
    score: 82,
    color: "#e5a32a",
    text: "相关能力呈现",
  },
];

export const resumePreferenceDefaults = {
  status: "应届毕业生",
  type: "校招",
  industry: "互联网 / IT",
  job: "前端开发工程师",
  city: "杭州",
  salary: "10–15K",
  company: "不限",
  arrival: "毕业后",
};
