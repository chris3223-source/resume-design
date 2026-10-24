import React from "react";
export function ReportPage({ action, children }) {
  return (
    <div className="job-report-tab-page">
      {action && <div className="job-report-page-actions">{action}</div>}
      <div className="job-report-tab-content">{children}</div>
    </div>
  );
}
