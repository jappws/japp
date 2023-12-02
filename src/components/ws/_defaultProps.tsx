import {
  BankOutlined,
  DashboardOutlined,
  TransactionOutlined,
} from "@ant-design/icons";

export const wsLayoutDefaultProps = {
  route: {
    path: "/",
    routes: [
      {
        key:"/ws",
        path: "/ws",
        name: "Dashboard",
        icon: <DashboardOutlined />,
      },
      {
        key:"/ws/bank_and_credits",
        path: "/ws/bank_and_credits",
        name: "Banque et Crédits",
        icon: <BankOutlined />,
      },
      {
        key:"/ws/transfers_and_credits",
        name: "Transferts et crédits",
        icon: <TransactionOutlined />,
        path: "/ws/transfers_and_credits",
      },
    ],
  },
  location: {
    pathname: "/",
  },
};
