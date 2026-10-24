import { jobMatchRows } from "../../mocks/job-matching.js";
export { jobMatchRows };
export function summarizeMatchingRows(rows) {
  return rows.reduce(
    (summary, row) => {
      summary.all += 1;
      summary[row.status === "需补充" ? "supplement" : "covered"] += 1;
      return summary;
    },
    { all: 0, supplement: 0, covered: 0 },
  );
}

export function filterMatchingRows(rows, filter) {
  if (filter === "supplement") {
    return rows.filter((row) => row.status === "需补充");
  }
  if (filter === "covered") {
    return rows.filter((row) => row.status === "已覆盖");
  }
  return rows;
}
