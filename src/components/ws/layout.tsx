"use client";

import {
  BankOutlined,
  CaretDownFilled,
  DashboardOutlined,
  DoubleRightOutlined,
  LaptopOutlined,
  LogoutOutlined,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  TransactionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import {
  PageContainer,
  ProCard,
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from "@ant-design/pro-components";
//   import { css } from '@emotion/css';
import {
  Button,
  ConfigProvider,
  Divider,
  Dropdown,
  Input,
  Menu,
  Popover,
  theme,
} from "antd";
import React, { useState } from "react";
import { wsLayoutDefaultProps } from "./_defaultProps";
import { usePathname, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { signOut } from "next-auth/react";

const currentYear = dayjs().format("YYYY");

const Item: React.FC<{ children: React.ReactNode }> = (props) => {
  const { token } = theme.useToken();
  return (
    <div
      // className={css`
      //   color: ${token.colorTextSecondary};
      //   font-size: 14px;
      //   cursor: pointer;
      //   line-height: 22px;
      //   margin-bottom: 8px;
      //   &:hover {
      //     color: ${token.colorPrimary};
      //   }
      // `}
      style={{
        width: "33.33%",
      }}
    >
      {props.children}
      <DoubleRightOutlined
        style={{
          marginInlineStart: 4,
        }}
      />
    </div>
  );
};

const SearchInput = () => {
  const { token } = theme.useToken();
  return (
    <div
      key="SearchOutlined"
      aria-hidden
      style={{
        display: "flex",
        alignItems: "center",
        marginInlineEnd: 24,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Input
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
          backgroundColor: token.colorBgTextHover,
        }}
        prefix={
          <SearchOutlined
            style={{
              color: token.colorTextLightSolid,
            }}
          />
        }
        placeholder="搜索方案"
        bordered={false}
      />
      <PlusCircleFilled
        style={{
          color: token.colorPrimary,
          fontSize: 24,
        }}
      />
    </div>
  );
};

export const WSClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
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

  // const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');
  const { push } = useRouter();

  

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
          title="Japp"
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
            title: "089842",
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
                <div>© {currentYear} JAPP by crudflow</div>
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
