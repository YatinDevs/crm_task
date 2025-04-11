import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getDailyReport } from "../../api/tasks";
import ReportTable from "../../components/ui/ReportTable";

const DailyReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const date =
    searchParams.get("date") || new Date().toISOString().split("T")[0];
  const team = searchParams.get("team");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getDailyReport({ date, team });
        setReportData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [date, team]);

  if (loading) return <div>Loading report...</div>;
  if (error) return <div>Error: {error}</div>;

  const columns = [
    { header: "Employee", accessor: "employee" },
    { header: "Department", accessor: "department" },
    { header: "Task Type", accessor: "taskType" },
    { header: "Client", accessor: "clientName" },
    { header: "Status", accessor: "status" },
    { header: "Time Spent", accessor: "timeSpent" },
  ];

  // Add department-specific columns
  if (team === "designer") {
    columns.push(
      { header: "Design Status", accessor: "designStatus" },
      { header: "Post Topic", accessor: "postTopic" }
    );
  } else if (team === "developer_team") {
    columns.push({ header: "Module", accessor: "moduleName" });
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Daily Report - {new Date(date).toLocaleDateString()}
        </h1>
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) =>
              (window.location.search = `?date=${e.target.value}`)
            }
            className="p-2 border rounded"
          />
          {!team && (
            <select
              value={team || ""}
              onChange={(e) =>
                (window.location.search = `?team=${e.target.value}`)
              }
              className="p-2 border rounded"
            >
              <option value="">All Teams</option>
              <option value="designer">Design Team</option>
              <option value="developer_team">Development Team</option>
              {/* Add other teams */}
            </select>
          )}
        </div>
      </div>

      <ReportTable columns={columns} data={reportData} />

      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-medium mb-2">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <p className="text-2xl font-bold">{reportData.length}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-2xl font-bold">
              {reportData.filter((t) => t.status === "Completed").length}
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
            <p className="text-2xl font-bold">
              {reportData.reduce((sum, task) => sum + (task.timeSpent || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;
