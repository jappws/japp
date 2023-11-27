"use client";

import {
  LaptopOutlined,
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
import { Dropdown } from "antd";
import React, { useState } from "react";
import { wsLayoutDefaultProps } from "./_defaultProps";
import { usePathname, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CompanyType } from "@/lib/types";

const currentYear = dayjs().format("YYYY");

export const WSClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
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
          logo={<LaptopOutlined />}
          {...wsLayoutDefaultProps}
          location={{
            pathname,
          }}
          token={{
            header: {
              // colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
            },
          }}
          // siderMenuType="group"
          hasSiderMenu={true}
          defaultCollapsed={true}
          menu={
            {
              // collapsedShowGroupTitle: true,
            }
          }
          avatarProps={{
            className: " bg-primary",
            icon: <UserOutlined />,
            size: "small",
            title: `${session?.user.username}`,
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
                        // push("")
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
                  <span className=" uppercase">{company?.shortName ?? ""}</span>{" "}
                  Designed by crudflow
                </div>
              </div>
            );
          }}
          selectedKeys={[pathname]}
          onMenuHeaderClick={(e) => push("/ws")}
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
          {children}
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
        </ProLayout>
      </ProConfigProvider>
    </div>
  );
};
