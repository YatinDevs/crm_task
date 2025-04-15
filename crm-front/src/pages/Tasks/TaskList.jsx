import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Popconfirm,
  Spin,
  Descriptions,
  Timeline,
  Card,
  Tabs,
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../../services/api";
import dayjs from "dayjs";
import { Tag } from "antd";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("list");

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "gray";
      case "in progress":
      case "in-progress":
        return "blue";
      case "completed":
        return "green";
      case "review":
        return "purple";
      case "approved":
        return "cyan";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/task/my-tasks");
      if (response.data.success) {
        setTasks(response.data.tasks);
      } else {
        message.error("Failed to fetch tasks");
      }
    } catch (error) {
      message.error("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (task) => {
    setSelectedTask(task);
    setViewModalVisible(true);
  };

  const handleEdit = (task) => {
    message.info(
      `Edit functionality for task "${task.title}" is not implemented yet.`
    );
  };

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/task/${taskId}`);
      message.success("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      message.error("Failed to delete task");
    }
  };

  const getStatusHistory = (task) => {
    // Combine daily updates with task creation and updates
    const history = [];

    // Add task creation
    history.push({
      timestamp: task.createdAt,
      status: task.status,
      type: "task_created",
      description: "Task was created",
    });

    // Add daily updates
    task.dailyUpdates?.forEach((update) => {
      history.push({
        timestamp: update.createdAt,
        status: update.status,
        type: "daily_update",
        description: update.update,
        hoursWorked: update.hoursWorked,
      });
    });

    // Add task updates (if updatedAt is different from createdAt)
    if (task.updatedAt !== task.createdAt) {
      history.push({
        timestamp: task.updatedAt,
        status: task.status,
        type: "task_updated",
        description: "Task was updated",
      });
    }

    // Sort by timestamp
    return history.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (_, record) => record.assigner?.username || "Self",
    },
    {
      title: "Started At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("DD MMM YYYY HH:mm"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) => dayjs(dueDate).format("DD MMM YYYY"),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: "Current Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, task) => (
        <>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(task)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(task)}
          />
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(task.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Tasks</h2>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Task List" key="list">
          {loading ? (
            <Spin />
          ) : (
            <Table
              dataSource={tasks}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Status Timeline" key="timeline">
          <div className="grid grid-cols-1 gap-4">
            {tasks.map((task) => (
              <Card
                key={task.id}
                title={`${task.title} (${task.status})`}
                extra={
                  <Button
                    type="link"
                    onClick={() => {
                      setSelectedTask(task);
                      setViewModalVisible(true);
                    }}
                  >
                    View Details
                  </Button>
                }
              >
                <Timeline mode="left">
                  {getStatusHistory(task).map((item, index) => (
                    <Timeline.Item
                      key={index}
                      color={getStatusColor(item.status)}
                      label={dayjs(item.timestamp).format("DD MMM YYYY HH:mm")}
                    >
                      <strong>{item.status}</strong>
                      {item.type === "daily_update" && (
                        <div>
                          <p>{item.description}</p>
                          <small>Hours worked: {item.hoursWorked}</small>
                        </div>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            ))}
          </div>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={`Task Details - ${selectedTask?.title}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTask && (
          <>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Title">
                {selectedTask.title}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedTask.description}
              </Descriptions.Item>
              <Descriptions.Item label="Assigned To">
                {selectedTask.assigner?.username || "Self"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {dayjs(selectedTask.createdAt).format("DD MMM YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {dayjs(selectedTask.updatedAt).format("DD MMM YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {dayjs(selectedTask.dueDate).format("DD MMM YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Current Status">
                <Tag color={getStatusColor(selectedTask.status)}>
                  {selectedTask.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Estimated Hours">
                {selectedTask.estimatedHours}
              </Descriptions.Item>
              <Descriptions.Item label="Actual Hours">
                {selectedTask.actualHours}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Status History</h3>
              <Timeline mode="left">
                {getStatusHistory(selectedTask).map((item, index) => (
                  <Timeline.Item
                    key={index}
                    color={getStatusColor(item.status)}
                    label={dayjs(item.timestamp).format("DD MMM YYYY HH:mm")}
                  >
                    <strong>{item.status}</strong>
                    {item.description && <p>{item.description}</p>}
                    {item.hoursWorked && (
                      <small>Hours worked: {item.hoursWorked}</small>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TaskList;
