"use client";

import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import {
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from "@ant-design/pro-components";
import { Avatar, Button, Dropdown } from "antd";
import React, { useState } from "react";
import { wsLayoutDefaultProps } from "./_defaultProps";
import { usePathname, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CompanyType } from "@/lib/types/index.d";
import { CurrentUserRightSider } from "./settings/users/user/currentUserProfile";
import { cn, getHSLColor } from "@/lib/utils";
import useOnlineStatus from "@/hooks/onlineStatus";
import { OfflineNotificationCard } from "../offlineCard";

const currentYear = dayjs().format("YYYY");

export const WSClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isOnline } = useOnlineStatus()
  const { data: session } = useSession();

  const [openUserProfile, setOpenUserProfile] = useState<boolean>(false);

  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: "side",
    splitMenus: false,
    navTheme: "light",
    contentWidth: "Fluid",
    colorPrimary: "#012D63",
    siderMenuType: "group",
    fixedHeader: false,
  });

  const { push } = useRouter();

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company"],
    queryFn: () =>
      axios.get(`/api/v1/ws/company`).then((res) => res.data as CompanyType),
  });

  return (
    <div
      id="japp-ws-pro-layout"
      style={{
        height: "100vh",
        // overflow: "auto",
      }}
    >
      <ProConfigProvider hashed={false}>
        <ProLayout
          title={company?.shortName ?? ""}
          logo={company?.icon}
          {...wsLayoutDefaultProps}
          location={{
            pathname,
          }}
          hasSiderMenu={true}
          defaultCollapsed={true}
          avatarProps={{
            style: {
              backgroundColor: getHSLColor(
                `${session?.user?.firstName} ${session?.user?.lastName} ${session?.user?.surname}`
              ),
            },
            // icon: <UserOutlined />,
            children: `${session?.user?.firstName
              ?.charAt(0)
              .toUpperCase()}${session?.user?.lastName
                ?.charAt(0)
                .toUpperCase()}`,
            size: "small",
            title: `${session?.user?.username ?? ""}`,
            render: (props, dom) => {
              return (
                <Dropdown
                  arrow
                  menu={{
                    items: [
                      {
                        key: "profile",
                        icon: <UserOutlined />,
                        label: "Mon profile",
                      },
                      {
                        key: "logout",
                        icon: <LogoutOutlined />,
                        label: "Déconnexion",
                      },
                    ],
                    onClick: ({ key }) => {
                      if (key === "profile") {
                        setOpenUserProfile(true);
                      } else if (key === "logout") {
                        signOut({ redirect: true, callbackUrl: "/" });
                      }
                    },
                  }}
                >
                  {dom}
                </Dropdown>
              );
            },
          }}
          actionsRender={(props) => {
            // if (props.isMobile) return [];
            // if (typeof window === 'undefined') return [];
            return [
              // <TeamOutlined key="TeamOutlined" />,
              <SettingOutlined
                key="SettingOutlined"
                onClick={() => {
                  push("/ws/settings");
                }}
                className={cn(
                  session?.user.role === "ADMIN" ? "block" : "hidden"
                )}
              />,
            ];
          }}
          menuFooterRender={(props) => {
            if (props?.collapsed) return <div>© {currentYear}</div>;
            return (
              <div
                style={{
                  // textAlign: 'center',
                  paddingBlockStart: 12,
                }}
              >
                <div>
                  © {currentYear}{" "}
                  <span className="">{company?.name ?? ""}</span>
                </div>
              </div>
            );
          }}
          selectedKeys={[pathname]}
          onMenuHeaderClick={(e) => push("/ws")}
          menu={{ locale: false }}
          menuItemRender={(item, dom) => (
            <div
              onClick={() => {
                push(item.path || "/ws");
              }}
            >
              {dom}
            </div>
          )}
          {...settings}
        >
            {isOnline && session?.user ? children : <OfflineNotificationCard/>}

          {/* <SettingDrawer
              pathname={pathname}
              enableDarkTheme
              getContainer={(e: any) => {
                if (typeof window === "undefined") return e;
                return document.getElementById("japp-ws-pro-layout");
              }}
              settings={settings}
              onSettingChange={(changeSetting) => {
                setSetting(changeSetting);
              }}
              disableUrlParams={true}
            /> */}
          <CurrentUserRightSider
            open={openUserProfile}
            trigger={setOpenUserProfile}
          />
        </ProLayout>
      </ProConfigProvider>
    </div>
  );
};
