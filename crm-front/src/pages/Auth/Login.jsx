import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card, Divider, message } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login, checkAuth } = useAuthStore();
  const [form] = Form.useForm();

  useEffect(() => {
    // Check if user is already logged in
    const checkExistingAuth = async () => {
      try {
        await checkAuth();
        const isAuth = useAuthStore.getState().isAuthenticated;
        if (isAuth) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log("Auth check error:", error);
      }
    };
    checkExistingAuth();
  }, [checkAuth]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const success = await login(values);
      if (success) {
        await checkAuth();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card
          className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden border-none"
          bodyStyle={{ padding: 0 }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="hidden md:block md:w-1/2 bg-indigo-600 relative">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Login Illustration"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-indigo-600 opacity-20"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h1 level={3} className="text-3xl font-bold text-white">
                  Welcome Back!
                </h1>
                <p className="text-xl text-white opacity-80">
                  Enter your credentials to access your account and manage your
                  tasks efficiently.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="w-full md:w-1/2 p-8 md:p-10 bg-white">
              <div className="text-center mb-8">
                <Title level={3} className="mb-2">
                  Sign In
                </Title>
                <Text type="secondary">
                  Enter your details to continue to your dashboard
                </Text>
              </div>

              <Form
                form={form}
                name="login-form"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="your.email@example.com"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="••••••••"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item className="mb-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    block
                    className="rounded-lg h-12 font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    Sign In
                  </Button>
                </Form.Item>

                <Divider plain className="text-gray-400">
                  or
                </Divider>

                <div className="text-center">
                  <Text type="secondary" className="text-sm">
                    Don't have an account?{" "}
                    <a
                      href="/signup"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Sign up
                    </a>
                  </Text>
                </div>
              </Form>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
