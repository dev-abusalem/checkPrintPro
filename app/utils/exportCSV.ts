function prettifyHeader(key: string): string {
  return key
    // handle snake_case
    .replace(/_/g, " ")
    // insert space before capital letters (camelCase, PascalCase)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // capitalize first letter of each word
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

export function exportToCSV<T extends object>(data: T[], fileName: string) {
  if (!data || data.length === 0) {
    console.warn("No data available for CSV export");
    return;
  }

  const headers = Object.keys(data[0]) as (keyof T)[];

  // Dynamic human-readable labels
  const headerLabels = headers.map((h) => prettifyHeader(h as string));

  const csvRows = [
    headerLabels.join(","), // Header row
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
