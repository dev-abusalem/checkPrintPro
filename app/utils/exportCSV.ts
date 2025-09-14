export function exportToCSV<T extends object>(data: T[], fileName: string) {
  if (!data || data.length === 0) {
    console.warn("No data available for CSV export");
    return;
  }

  // Cast keys properly
  const headers = Object.keys(data[0]) as (keyof T)[];

  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((field) => {
          const val = row[field];
          if (typeof val === "string") {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val !== undefined && val !== null ? String(val) : "";
        })
        .join(",")
    ),
  ];

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.csv`;
  a.click();

  window.URL.revokeObjectURL(url);
}
