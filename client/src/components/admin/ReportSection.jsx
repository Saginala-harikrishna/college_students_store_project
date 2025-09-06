import React, { useState, useEffect } from "react";
import '../../css/ReportSection.css';
import * as XLSX from "xlsx"; // For Excel export

const dailyReports = [
  { id: "studentWise", label: "Student-wise Sales Report", api: "http://localhost:5000/api/reports/daily/student-wise" },
  { id: "itemWise", label: "Item-wise Sales Report", api: "http://localhost:5000/api/reports/daily/item-wise" },
  { id: "lowBalance", label: "Low Balance Report", api: "http://localhost:5000/api/reports/daily/low-balance" },
];

const monthlyReports = [
  { id: "monthlySales", label: "Monthly Sales Summary", api: "http://localhost:5000/api/reports/monthly/sales-summary" },
  { id: "inventoryUsage", label: "Inventory Usage Report", api: "http://localhost:5000/api/reports/monthly/inventory-usage" },
  { id: "studentActivity", label: "Student Activity Report", api: "http://localhost:5000/api/reports/monthly/student-activity" },
];

const ReportSection = () => {
  const [reportCategory, setReportCategory] = useState("daily");
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!selectedReport) return;

      const allReports = [...dailyReports, ...monthlyReports];
      const reportObj = allReports.find(r => r.id === selectedReport);
      if (!reportObj) return;

      setLoading(true);
      try {
        const res = await fetch(reportObj.api);
        const data = await res.json();
        setReportData(data);
      } catch (err) {
        console.error("Failed to fetch report data:", err);
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedReport]);

  const renderReportLinks = (reports) => (
    <div className="report-links" style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
      {reports.map((report) => (
        <button
          key={report.id}
          style={{
            padding: "8px 15px",
            backgroundColor: selectedReport === report.id ? "#4CAF50" : "#f0f0f0",
            color: selectedReport === report.id ? "#fff" : "#000",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setSelectedReport(report.id)}
        >
          {report.label}
        </button>
      ))}
    </div>
  );

  const renderTable = () => {
    if (!reportData || reportData.length === 0) return <div>No records found.</div>;

    const headers = Object.keys(reportData[0]);

    return (
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
        marginTop: "10px"
      }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={{ borderBottom: "2px solid #ccc", padding: "8px", backgroundColor: "#f5f5f5" }}>
                {header.replace(/_/g, " ").toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff" }}>
              {headers.map((header) => (
                <td key={header} style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleDownload = () => {
    if (!reportData || reportData.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, selectedReport || "Report");
    XLSX.writeFile(wb, `${selectedReport || "report"}.xlsx`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "15px" }}>Reports</h2>

      {/* Category Tabs */}
      <div style={{ marginBottom: "15px" }}>
        <button
          style={{
            padding: "8px 15px",
            marginRight: "10px",
            borderRadius: "5px",
            backgroundColor: reportCategory === "daily" ? "#1976d2" : "#f0f0f0",
            color: reportCategory === "daily" ? "#fff" : "#000",
            border: "1px solid #ccc",
            cursor: "pointer"
          }}
          onClick={() => { setReportCategory("daily"); setSelectedReport(null); setReportData([]); }}
        >
          Daily Reports
        </button>
        <button
          style={{
            padding: "8px 15px",
            borderRadius: "5px",
            backgroundColor: reportCategory === "monthly" ? "#1976d2" : "#f0f0f0",
            color: reportCategory === "monthly" ? "#fff" : "#000",
            border: "1px solid #ccc",
            cursor: "pointer"
          }}
          onClick={() => { setReportCategory("monthly"); setSelectedReport(null); setReportData([]); }}
        >
          Monthly Reports
        </button>
      </div>

      {/* Report Links */}
      {reportCategory === "daily" && <>
        <h3>Daily Reports</h3>
        {renderReportLinks(dailyReports)}
      </>}
      {reportCategory === "monthly" && <>
        <h3>Monthly Reports</h3>
        {renderReportLinks(monthlyReports)}
      </>}

      {/* Report Table */}
      <div style={{ marginTop: "15px" }}>
        {loading ? "Loading report data..." : selectedReport && renderTable()}
        {!selectedReport && !loading && "Select a report to view its data"}
      </div>

      {/* Download Button */}
      {selectedReport && reportData.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <button
            onClick={handleDownload}
            style={{
              padding: "8px 15px",
              borderRadius: "5px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            Download Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportSection;
