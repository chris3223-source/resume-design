import {
  resumeOptimizationStyles,
  resumeOptimizationRows,
} from "../../mocks/resume-optimization.js";
export { resumeOptimizationStyles, resumeOptimizationRows };
export function getResumeOptimizationRow(moduleName) {
  return (
    resumeOptimizationRows.find(({ module }) => module === moduleName) ??
    resumeOptimizationRows[0]
  );
}
