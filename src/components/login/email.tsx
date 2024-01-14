"use client";

import { LoadingOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { Button, Form, Input, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type LoginFormData = {
  email: string;
  password: string;
};

export const LoginFormByEmail = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/ws";

  const handlesubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });

      setLoading(false);

      if (!res?.error) {
        push(callbackUrl);
      } else {
        message.error("L'adresse mail ou le mot de passe est incorrect!");
        console.log(res.error)
      }
    } catch (error: any) {
      setLoading(false);
      message.error(`Ouf, une erreur est survenue, Veuillez réessayer!`);
    }
  };

  return (
    <Form
      requiredMark="optional"
      form={form}
      layout="vertical"
      name="loginForm"
      onFinish={handlesubmit}
      disabled={loading}
      size="large"
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message:"L'adresse mail est obligatoire"
          },
          {
            type: "email",
            message: "Le format de l'email n'est pas valide!",
          },
        ]}
      >
        <Input style={{ backgroundColor: "#fff" }} placeholder="Adresse mail" prefix={ <MailOutlined className={"prefixIcon"} />}/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message:"Le mot de passe est obligatoire"
          },
        ]}
        
      >
        <Input.Password className="bg-white" placeholder="Mot de passe" prefix={<LockOutlined className={"prefixIcon"} />} />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          block={true}
          className="shadow-none uppercase"
          icon={loading ? <LoadingOutlined /> : undefined}
        >
          Connecter
        </Button>
      </Form.Item>
    </Form>
  );
};