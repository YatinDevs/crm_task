import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Tag,
  Modal,
  Descriptions,
  Divider,
  Space,
  Input,
} from "antd";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/api";
import { SearchOutlined } from "@ant-design/icons";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, [pagination.current, pagination.pageSize]);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/emp/get-employee", {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          search: searchText,
        },
      });
      setEmployees(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.pagination?.totalItems || 0,
      });
    } catch (error) {
      message.error("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const roleColors = {
    admin: "red",
    employee: "blue",
    hr: "green",
    accounts: "orange",
    sales: "purple",
    support: "cyan",
    designer: "magenta",
    social_media: "volcano",
    developer_team: "gold",
    manager: "geekblue",
  };

  const departmentColors = {
    "Development Team": "geekblue",
    "HR Team": "green",
    "SMM Team": "volcano",
    "Designer Team": "magenta",
    "Sales Team": "purple",
    "Support Team": "cyan",
    "Accounts Team": "orange",
    Manager: "gold",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const showEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
    fetchEmployees();
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text, record) => (
        <Button type="link" onClick={() => showEmployeeDetails(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={roleColors[role] || "default"} key={role}>
          {role.toUpperCase().replace("_", " ")}
        </Tag>
      ),
      filters: Object.keys(roleColors).map((role) => ({
        text: role.toUpperCase().replace("_", " "),
        value: role,
      })),
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (department) => (
        <Tag color={departmentColors[department] || "default"} key={department}>
          {department}
        </Tag>
      ),
      filters: [
        "Development Team",
        "HR Team",
        "SMM Team",
        "Designer Team",
        "Sales Team",
        "Support Team",
        "Accounts Team",
        "Manager",
      ].map((dept) => ({
        text: dept,
        value: dept,
      })),
      onFilter: (value, record) => record.department === value,
    },
    {
      title: "Joined Date",
      dataIndex: "joining_date",
      key: "joining_date",
      render: formatDate,
      sorter: (a, b) => new Date(a.joining_date) - new Date(b.joining_date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEmployeeDetails(record)}>
            View
          </Button>
          <Link to={`/dashboard/employees/edit/${record.id}`}>
            <Button type="link">Edit</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="add-employee-container mt-10 p-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employee List</h2>
        <Input.Search
          placeholder="Search employees"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: 300 }}
          onSearch={handleSearch}
        />
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total) => `Total ${total} employees`,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title="Employee Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          <Link
            key="edit"
            to={`/dashboard/employees/edit/${selectedEmployee?.id}`}
          >
            <Button type="primary">Edit</Button>
          </Link>,
        ]}
        width={800}
      >
        {selectedEmployee && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Username">
              {selectedEmployee.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedEmployee.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={roleColors[selectedEmployee.role] || "default"}>
                {selectedEmployee.role.toUpperCase().replace("_", " ")}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              <Tag
                color={
                  departmentColors[selectedEmployee.department] || "default"
                }
              >
                {selectedEmployee.department}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedEmployee.phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Alternate Phone">
              {selectedEmployee.alternate_phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Designation">
              {selectedEmployee.designation || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {formatDate(selectedEmployee.dob)}
            </Descriptions.Item>
            <Descriptions.Item label="Joining Date">
              {formatDate(selectedEmployee.joining_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Probation End Date">
              {formatDate(selectedEmployee.probation_end_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Training End Date">
              {formatDate(selectedEmployee.training_end_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Increment Date">
              {formatDate(selectedEmployee.increment_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Anniversary Date">
              {formatDate(selectedEmployee.anniversary_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {selectedEmployee.address || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Group">
              {selectedEmployee.blood_group || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeList;
