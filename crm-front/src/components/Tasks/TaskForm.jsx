import { useState } from "react";
import { useUserRole } from "../../hooks/useAuth";

const TaskForm = ({ onSubmit, initialData = {} }) => {
  const [task, setTask] = useState({
    taskType: "",
    description: "",
    clientName: "",
    status: "Not Started",
    followUpRequired: false,
    remarks: "",
    ...initialData,
  });

  const role = useUserRole();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
  };

  const renderDepartmentFields = () => {
    switch (role) {
      case "designer":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Post Topic
              </label>
              <input
                type="text"
                name="postTopic"
                value={task.postTopic || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Design Status
              </label>
              <select
                name="designStatus"
                value={task.designStatus || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Status</option>
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </>
        );
      case "developer_team":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Module Name
              </label>
              <input
                type="text"
                name="moduleName"
                value={task.moduleName || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Time Spent (hours)
              </label>
              <input
                type="number"
                step="0.5"
                name="timeSpent"
                value={task.timeSpent || 0}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        );
      // Add other department cases...
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Task Type</label>
        <input
          type="text"
          name="taskType"
          value={task.taskType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full p-2 border rounded"
        />
      </div>

      {renderDepartmentFields()}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {initialData.id ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
};

export default TaskForm;
