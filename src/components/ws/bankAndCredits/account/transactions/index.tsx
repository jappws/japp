"use client";

import { TransactionsList } from "./list";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { RangeValue, TransactionType } from "@/lib/types";
import { useParams } from "next/navigation";
import { Button, DatePicker, Select, Space } from "antd";
import {
  CloseOutlined,
  FilterOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { isNull } from "lodash";

dayjs.extend(isBetween);

export const AccountTransactions = () => {
  const { data: session } = useSession();
  const { accountId } = useParams();

  const [selectedCurrentData, setSelectedCurrentData] = useState<
    TransactionType[] | undefined
  >();

  const [showFilter, setShowFilter] = useState<boolean>(false);

  const [datesFilterValue, setDatesFilterValue] = useState<RangeValue>();

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", accountId],
    queryFn: () =>
      axios
        .get(`/api/v1/ws/account/${accountId}/transactions`)
        .then((res) => res.data as TransactionType[]),
    enabled: !!session?.user && !!accountId,
  });

  // filter by dates and other if exist
  const filterByDates = (value: RangeValue) => {
    let newFilteredData: TransactionType[] | undefined = [];

    if (
      typeof value !== "undefined" &&
      (!isNull(value?.[0]) || !isNull(value?.[0]))
    ) {
      newFilteredData = data?.filter((item) =>
        dayjs(item?.date).isBetween(value?.[0], value?.[1], "dates", "[]")
      );
    } else {
      newFilteredData = data;
    }

    // if (
    //   typeof paymentFilterValue === "string" &&
    //   paymentFilterValue !== "all"
    // ) {
    //   const isPaid = paymentFilterValue === "paid" ? true : false;
    //   newFilteredData = newFilteredData?.filter(
    //     (item) => item.isPaid === isPaid
    //   );
    // }

    // if (typeof statusFilterValue === "string" && statusFilterValue !== "all") {
    //   newFilteredData = newFilteredData?.filter(
    //     (item) => item.status === statusFilterValue
    //   );
    // }
    setDatesFilterValue(value);
    setSelectedCurrentData(newFilteredData);
  };

  useEffect(() => {
    setSelectedCurrentData(data);
  }, [data]);
  return (
    <div>
      <header className="min-h-[64px] flex flex-col lg:flex-row lg:items-center space-y-3 space-x-3 lg:space-y-0  px-0 mb-4 lg:mb-0 ">
        <div className="flex space-x-4">
          <Button
            icon={<FilterOutlined />}
            className={cn("shadow-none", showFilter ? "hidden" : "block")}
            onClick={() => {
              setShowFilter(true);
            }}
          >
            Filtrer
          </Button>
        </div>
        {/* <div
            className={cn(
              "",
              showFilter ? "flex items-center space-x-3" : "hidden"
            )}
          >
            <p className="text-[#8c8c8c]">Paiements</p>
            <Select
              className=" min-w-[120px]"
              defaultValue={paymentFilterValue}
              value={paymentFilterValue}
              style={{ width: 120 }}
              onChange={filterByPaymentStatus}
              options={[
                { value: "all", label: "Tous" },
                { value: "paid", label: "Payé(s)" },
                { value: "unpaid", label: "Non payé(s)" },
              ]}
              menuItemSelectedIcon={<CheckOutlined />}
            />
          </div> */}
        {/* <div
            className={cn(
              "",
              showFilter ? "flex items-center space-x-3" : "hidden"
            )}
          >
            <p className="text-[#8c8c8c]">Statuts</p>
            <Select
              className=" min-w-[120px]"
              defaultValue={statusFilterValue}
              value={statusFilterValue}
              style={{ width: 120 }}
              onChange={filterByStatus}
              options={[
                { value: "all", label: "Tous" },
                { value: "opened", label: "En cours" },
                { value: "counted", label: "Finalisé(s)" },
                { value: "deleted", label: "Annulé(s)" },
              ]}
              menuItemSelectedIcon={<CheckOutlined />}
            />
          </div> */}

        <div
          className={cn(
            "",
            showFilter ? "flex items-center space-x-3" : "hidden"
          )}
        >
          <p className="text-[#8c8c8c]">Dates</p>
          <DatePicker.RangePicker
            allowClear={false}
            defaultValue={datesFilterValue}
            value={datesFilterValue}
            format="DD/MM/YYYY"
            className="flex-1"
            onChange={filterByDates}
          />
        </div>
        <Space>
          <Button
            className={cn("", showFilter ? "block" : "hidden")}
            icon={<CloseOutlined />}
            onClick={() => {
              // setSelectedCurrentData(data);
              // setPaymentFilterValue("all");
              // setStatusFilterValue("all");
              setDatesFilterValue(undefined);
              setShowFilter(false);
            }}
            danger
          >
            Effacer filtres
          </Button>
        </Space>
        <div className="flex-1 hidden lg:block" />
        <div className="flex space-x-3">
          <div className="flex-1" />

          <Button icon={<PrinterOutlined />} className="shadow-none">
            Imprimer
          </Button>
        </div>
      </header>
      <TransactionsList data={selectedCurrentData} isLoading={isLoading} />
    </div>
  );
};
