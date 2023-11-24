"use client";

import { ProCard } from "@ant-design/pro-components";
import { TransactionsList } from "./list";

export const AccountTransactions = () => {
  return (
    <div>
      {/* <ProCard className="min-h-[800px]"> */}
        <TransactionsList data={[]} />
      {/* </ProCard> */}
    </div>
  );
};
