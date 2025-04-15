import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Button, message } from "antd";
import axiosInstance from "../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const CreateTask = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch all employees
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get("/emp/get-employee");
        setEmployees(response.data.data || []);
      } catch (error) {
        message.error("Failed to fetch employees");
      }
    };

    // Fetch current user
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setCurrentUser(response.data.user);
      } catch (error) {
        message.error("Failed to fetch current user");
      }
    };

    fetchEmployees();
    fetchCurrentUser();
  }, []);

  const onFinish = async (values) => {
    try {
      console.log(values);
      const payload = {
        ...values,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
      };

      if (values.assignedTo === "self") {
        // Create task for self
        await axiosInstance.post("/task/self", payload);
      } else {
        // Create task for selected employee
        await axiosInstance.post("/task", payload);
      }

      message.success("Task created successfully");
      form.resetFields();
    } catch (error) {
      message.error("Failed to create task");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create Task</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="assignedTo"
          label="Assign To"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select an employee">
            <Option value="self">Self</Option>
            {employees.map((emp) => (
              <Option key={emp.id} value={emp.id}>
                {emp.username} ({emp.email})
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select priority">
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
            <Option value="critical">Critical</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="estimatedHours"
          label="Estimated Hours"
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Task
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTask;
