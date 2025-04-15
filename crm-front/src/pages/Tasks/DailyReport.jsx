import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, message, Spin } from "antd";
import axiosInstance from "../../services/api";
import TaskList from "./TaskList";

const { Option } = Select;

const DailyUpdate = () => {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's tasks on component mount
  useEffect(() => {
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

    fetchTasks();
  }, []);

  // Handle form submission
  const onFinish = async (values) => {
    try {
      await axiosInstance.post("/task/daily-update", values);
      message.success("Daily update added successfully");
      form.resetFields();
    } catch (error) {
      message.error("Failed to add daily update");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Add Daily Update</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="taskId"
          label="Select Task"
          rules={[{ required: true, message: "Please select a task" }]}
        >
          <Select
            placeholder="Select your task"
            loading={loading}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {tasks.map((task) => (
              <Option key={task.id} value={task.id}>
                {task.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="update"
          label="Update"
          rules={[{ required: true, message: "Please enter your update" }]}
        >
          <Input.TextArea rows={4} placeholder="Describe your progress..." />
        </Form.Item>

        <Form.Item
          name="hoursWorked"
          label="Hours Worked"
          rules={[{ required: true, message: "Please enter hours worked" }]}
        >
          <InputNumber min={0} className="w-full" placeholder="e.g., 2.5" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select status">
            <Option value="pending">Pending</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="completed">Completed</Option>
            <Option value="review">Review</Option>
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Update
          </Button>
        </Form.Item>
      </Form>
      <TaskList />
    </div>
  );
};

export default DailyUpdate;
