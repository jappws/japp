"use client";

import {
  LoadingOutlined,
  LockOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { Button, Form, Input, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PhoneInput from "antd-phone-input";

type LoginFormData = {
  email: string;
  password: string;
};

export const LoginFormByPhone = () => {
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
        message.error(
          "Le numéro de téléphone ou le mot de passe est incorrect!"
        );
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
            message: "Le numéro de téléphone est obligatoire",
          },
        ]}
      >
        <PhoneInput
          placeholder="Numéro de téléphone"
          searchPlaceholder="Rechercher un pays"
          country="cd"
          enableSearch={true}
          preferredCountries={["cd"]}
          // prefix={<MobileOutlined className={"prefixIcon"} />}
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Le mot de passe est obligatoire",
          },
        ]}
      >
        <Input.Password
          className="bg-white"
          placeholder="Mot de passe"
          prefix={<LockOutlined className={"prefixIcon"} />}
        />
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
