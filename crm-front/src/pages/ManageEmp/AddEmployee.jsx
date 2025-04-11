import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Form,
  Input,
  Button,
  Select,
  Steps,
  DatePicker,
  message,
  Space,
  Row,
  Col,
  Upload,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../services/api";
import {
  AiOutlineUser,
  AiOutlineSolution,
  AiOutlineLock,
  AiOutlineCalendar,
} from "react-icons/ai";

const { Step } = Steps;
const { Option } = Select;

const AddEmployee = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handlePrev = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Format dates and prepare data
      const formattedValues = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        joining_date: values.joining_date
          ? values.joining_date.format("YYYY-MM-DD")
          : null,
        probation_end_date: values.probation_end_date
          ? values.probation_end_date.format("YYYY-MM-DD")
          : null,
        training_end_date: values.training_end_date
          ? values.training_end_date.format("YYYY-MM-DD")
          : null,
        increment_date: values.increment_date
          ? values.increment_date.format("YYYY-MM-DD")
          : null,
        anniversary_date: values.anniversary_date
          ? values.anniversary_date.format("YYYY-MM-DD")
          : null,
        reference_contacts: values.reference_contacts
          ? JSON.parse(values.reference_contacts)
          : null,
      };

      const response = await axiosInstance.post(
        "/emp/create-employee",
        formattedValues
      );

      if (response.data.success) {
        message.success("Employee onboarded successfully");
        form.resetFields();
        setCurrentStep(0);
      } else {
        message.error(response.data.message || "Failed to add employee");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const beforeUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("File must smaller than 5MB!");
    }
    return isLt5M;
  };

  return (
    <Card title="Add New Employee" className="p-6 mx-2 mt-10">
      <Steps current={currentStep} className="mb-6">
        <Step
          title="Personal Info"
          icon={<AiOutlineUser />}
          onClick={() => setCurrentStep(0)}
        />
        <Step
          title="Employment Details"
          icon={<AiOutlineSolution />}
          onClick={() => setCurrentStep(1)}
        />
        <Step
          title="Work & Status"
          icon={<AiOutlineLock />}
          onClick={() => setCurrentStep(2)}
        />
        <Step
          title="Additional Info"
          icon={<AiOutlineCalendar />}
          onClick={() => setCurrentStep(3)}
        />
      </Steps>

      <Form form={form} layout="vertical" className="mt-6">
        {currentStep === 0 && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Username is required" }]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Enter a valid email",
                  },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Phone number is required" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="alternate_phone" label="Alternate Phone">
                <Input placeholder="Enter alternate phone" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address" label="Address">
                <Input.TextArea rows={3} placeholder="Enter address" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {currentStep === 1 && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="designation"
                label="Designation"
                rules={[{ required: true, message: "Designation is required" }]}
              >
                <Input placeholder="Enter designation" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: "Department is required" }]}
              >
                <Select placeholder="Select department">
                  <Option value="Development Team">Development Team</Option>
                  <Option value="HR Team">HR Team</Option>
                  <Option value="SMM Team">SMM Team</Option>
                  <Option value="Designer Team">Designer Team</Option>
                  <Option value="Sales Team">Sales Team</Option>
                  <Option value="Support Team">Support Team</Option>
                  <Option value="Accounts Team">Accounts Team</Option>
                  <Option value="Manager">Manager</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dob" label="Date of Birth">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="blood_group" label="Blood Group">
                <Input placeholder="Enter blood group (e.g., A+)" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {currentStep === 2 && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="joining_date" label="Joining Date">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="probation_end_date" label="Probation End Date">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="training_end_date" label="Training End Date">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="increment_date" label="Increment Date">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="anniversary_date" label="Anniversary Date">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Role is required" }]}
              >
                <Select placeholder="Select role">
                  <Option value="employee">Employee</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="hr">HR</Option>
                  <Option value="developer_team">Developer Team</Option>
                  <Option value="social_media">Social Media</Option>
                  <Option value="designer">Designer</Option>
                  <Option value="sales">Sales</Option>
                  <Option value="support">Support</Option>
                  <Option value="accounts">Accounts</Option>
                  <Option value="manager">Manager</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}

        {currentStep === 3 && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="reference_contacts"
                label="Reference Contacts (JSON format)"
                extra="Format: [{name: 'John', phone: '1234567890', relation: 'Friend'}]"
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter reference contacts in JSON format"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="attachments"
                label="Attachments"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  beforeUpload={beforeUpload}
                  multiple={false}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  <Button icon={<UploadOutlined />}>Upload Documents</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        )}

        <div className="mt-6 text-right">
          <Space>
            {currentStep > 0 && (
              <Button onClick={handlePrev} style={{ minWidth: 80 }}>
                Back
              </Button>
            )}
            {currentStep < 3 ? (
              <Button
                type="primary"
                onClick={handleNext}
                style={{ minWidth: 80 }}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                style={{ minWidth: 80 }}
              >
                Submit
              </Button>
            )}
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default AddEmployee;
