import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TaskCard from "./TaskCard";
import { useTasks } from "../../hooks/useTasks";
import { useUserRole } from "../../hooks/useAuth";

const TaskList = () => {
  const { tasks, loading, error, fetchTasks } = useTasks();
  const role = useUserRole();
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    clientName: "",
  });

  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {role === "manager" ? "Team Tasks" : "My Tasks"}
        </h1>
        <Link
          to="/dashboard/tasks/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium mb-3">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client</label>
            <input
              type="text"
              name="clientName"
              value={filters.clientName}
              onChange={handleFilterChange}
              placeholder="Filter by client"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks found. Create your first task!
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} role={role} />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
