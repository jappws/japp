"use client";

import { useState } from "react";
import { LaptopOutlined, UserOutlined } from "@ant-design/icons";
import { Space, Card, Tabs, Typography, Avatar } from "antd";
import { LoginFormByEmail } from "./email";
import { LoginFormByPhone } from "./phone";
import { LoginType } from "@/lib/types/index.d";

export const LoginPageClientSide = () => {
  const [loginType, setLoginType] = useState<LoginType>(LoginType.EMAIL);
  return (
    <div className="min-h-screen flex items-center p-4">
      <Card bordered className="mx-auto">
        <div className="flex flex-col items-center jus space-x-2 my-5">
        <Avatar
            icon={<UserOutlined />}
            className="bg-primary"
          />
          {/* <Space>
        <Typography.Paragraph className="text-center text-4xl font-bold text-primary">
        Japp
        </Typography.Paragraph>
        <UserOutlined />
        </Space> */}
        </div>
        
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          items={[
            {
              key: "EMAIL",
              label: "Authentification",
              children: <LoginFormByEmail />,
              
            },
            // {
            //   key: "PHONE",
            //   label: "Téléphone",
            //   children: <LoginFormByPhone />,
            // },
          ]}
        />
      </Card>
    </div>
  );
};
