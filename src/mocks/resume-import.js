// 原型导入演示：步骤及结果均为本地模拟，未上传、解析文件或调用服务。
export const resumeImportSteps = [
  "读取简历内容",
  "提取基本信息",
  "整理经历内容",
  "美化简历",
  "创建简历",
];

export const resumeImportScenarios = [
  { value: "success", label: "顺利完成" },
  { value: "failure", label: "整理失败" },
  { value: "submit-error", label: "提交失败" },
  { value: "progress-error", label: "进度暂不可用" },
];
