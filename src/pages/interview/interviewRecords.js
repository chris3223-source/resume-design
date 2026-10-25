export function filterInterviewRecords(records, query, status, kind) {
  const term = query.trim().toLocaleLowerCase();
  return records.filter(
    (record) =>
      (!term ||
        `${record.job} ${record.company || ""}`
          .toLocaleLowerCase()
          .includes(term)) &&
      (status === "all" || record.status === status) &&
      (kind === "all" || record.kind === kind),
  );
}

export function summarizeInterviewRecords(records) {
  const scored = records.filter((record) => Number.isFinite(record.score));
  return {
    count: records.length,
    seconds: records.reduce(
      (total, record) => total + Math.max(0, record.elapsed || 0),
      0,
    ),
    average: scored.length
      ? Math.round(
          scored.reduce((sum, record) => sum + record.score, 0) / scored.length,
        )
      : null,
  };
}

export function formatPracticeTime(seconds) {
  return seconds < 60
    ? `${seconds} 秒`
    : `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`;
}
