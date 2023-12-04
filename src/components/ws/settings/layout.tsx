"use client";

import { PageContainer } from "@ant-design/pro-components";
import { usePathname, useRouter } from "next/navigation";
import { SettingOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { NewUserForm } from "./users/forms/newUserForm";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function SettingsClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useRouter();
  const pathname = usePathname();
  const [openNewUserForm, setOpenNewUserForm] = useState<boolean>(false);
  const { data: session } = useSession();

  return (
    <div>
      <PageContainer
        fixedHeader
        // style={{ backgroundColor: "#fff" }}
        title="Paramètres"
        token={{
          paddingInlinePageContainerContent: 16,
          paddingBlockPageContainerContent: 16,
        }}
        tabProps={{
          style: {},
          onChange: (activeKey) => {
            push(activeKey);
          },
        }}
        tabActiveKey={pathname}
        tabBarExtraContent={
          <Tooltip title="Créer un utilisateur">
            <Button
              type="primary"
              onClick={() => {
                setOpenNewUserForm(true);
              }}
              className={cn(
                "shadow-none uppercase",
                session?.user.role === "ADMIN" ? "block" : "hidden"
              )}
              icon={<UserAddOutlined />}
            />
          </Tooltip>
        }
        tabList={[
          {
            key: "/ws/settings",
            tab: "Entreprise",
          },
          {
            key: "/ws/settings/users",
            tab: "Utilisateurs",
          },
        ]}
        extra={[<SettingOutlined key="2" className="shadow-none uppercase" />]}
      >
        <div className="md:pt-4">
          {children}
          <NewUserForm open={openNewUserForm} toggle={setOpenNewUserForm} />
        </div>
      </PageContainer>
    </div>
  );
}
