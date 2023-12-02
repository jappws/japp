"use client";

import "dayjs/locale/fr";
import locale from "antd/locale/fr_FR";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import { AppContextProvider } from "@/lib/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { themeConfig } from "@/lib/antd/theme";
import StyledComponentsRegistry from "@/lib/antd/Registry";

const Provider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { networkMode: "offlineFirst" },
      mutations: { networkMode: "offlineFirst" },
    },
  });

  return (
    <SessionProvider session={session}>
      {/* <StyledComponentsRegistry> */}
        <ConfigProvider theme={themeConfig} locale={locale}>
          <QueryClientProvider client={queryClient}> {/* React query provider */}
            <AppContextProvider>{children}</AppContextProvider>
          </QueryClientProvider>
        </ConfigProvider>
      {/* </StyledComponentsRegistry> */}
    </SessionProvider>
  );
};

export default Provider;
