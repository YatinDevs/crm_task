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
} from "antd";
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
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    alternate_phone: "",
    designation: "",
    department: "",
    dob: "",
    joining_date: "",
    probation_end_date: "",
    training_end_date: "",
    role: "",
    blood_group: "",
    reference_contacts: "",
    address: "",
    attachments: "",
  });

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev) => ({ ...prev, ...values }));
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handlePrev = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };

      // Format dates
      Object.keys(finalData).forEach((key) => {
        if (finalData[key] instanceof dayjs) {
          finalData[key] = finalData[key].format("YYYY-MM-DD");
        }
      });

      const response = await axiosInstance.post(
        "http://localhost:8098/api/v1/emp/create-employee",
        finalData
      );

      if (response.data.success) {
        message.success("Employee onboarded successfully");
        form.resetFields();
        setFormData({});
        setCurrentStep(0);
      } else {
        message.error(response.data.message || "Failed to add employee");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="p-6 mx-2 mt-10 bg-white shadow-lg rounded-lg">
      <Steps current={currentStep}>
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

      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        className="mt-6"
      >
        {currentStep === 0 && (
          <>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input placeholder="Enter username" />
            </Form.Item>
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
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: "Phone number is required" }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item name="alternate_phone" label="Alternate Phone">
              <Input placeholder="Enter alternate phone" />
            </Form.Item>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: "Designation is required" }]}
            >
              <Input placeholder="Enter designation" />
            </Form.Item>
            <Form.Item
              name="department"
              label="Department"
              rules={[
                { required: true, message: "Please select a department" },
              ]}
            >
              <Select placeholder="Select department">
                <Option value="Development Team">Development Team</Option>
                <Option value="HR Team">HR Team</Option>
                <Option value="Marketing Team">Marketing Team</Option>
              </Select>
            </Form.Item>
            <Form.Item name="dob" label="Date of Birth">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input.TextArea placeholder="Enter address" />
            </Form.Item>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Form.Item name="joining_date" label="Joining Date">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="probation_end_date" label="Probation End Date">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="training_end_date" label="Training End Date">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select placeholder="Select role">
                <Option value="employee">Employee</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
          </>
        )}

        {currentStep === 3 && (
          <>
            <Form.Item name="blood_group" label="Blood Group">
              <Input placeholder="Enter blood group" />
            </Form.Item>
            <Form.Item name="reference_contacts" label="Reference Contacts">
              <Input.TextArea placeholder="Enter reference contacts" />
            </Form.Item>
            <Form.Item name="attachments" label="Attachments">
              <Input.TextArea placeholder="Upload attachments" />
            </Form.Item>
          </>
        )}

        <Space className="mt-6">
          {currentStep > 0 && (
            <Button onClick={handlePrev} className="bg-gray-500 text-white">
              Back
            </Button>
          )}
          {currentStep < 3 ? (
            <Button type="primary" onClick={handleNext} className="bg-blue-500">
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleSubmit}
              className="bg-green-500"
            >
              Submit
            </Button>
          )}
        </Space>
      </Form>
    </div>
  );
};

export default AddEmployee;
