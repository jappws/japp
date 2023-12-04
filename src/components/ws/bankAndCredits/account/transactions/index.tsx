"use client";

import { TransactionsList } from "./list";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  AccountType,
  CompanyType,
  RangeValue,
  TransactionType,
} from "@/lib/types/index.d";
import { useParams } from "next/navigation";
import { Avatar, Button, DatePicker, Image, Space } from "antd";
import {
  CloseOutlined,
  FilterOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { cn, getHSLColor } from "@/lib/utils";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { isNull } from "lodash";
import ReactToPrint from "react-to-print";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { TransactionsListToPrint } from "./listToPrint";

dayjs.extend(isBetween);

export const AccountTransactions = () => {
  const { data: session } = useSession();
  const { accountId } = useParams();

  const [selectedCurrentData, setSelectedCurrentData] = useState<
    TransactionType[] | undefined
  >();

  const [showFilter, setShowFilter] = useState<boolean>(false);

  const [datesFilterValue, setDatesFilterValue] = useState<RangeValue>();

  const refComponentToPrint = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", accountId],
    queryFn: () =>
      axios
        .get(`/api/v1/ws/account/${accountId}/transactions`)
        .then((res) => res.data as TransactionType[]),
    enabled: !!session?.user && !!accountId,
  });

  const { data: account } = useQuery({
    queryKey: ["account", accountId],
    queryFn: () =>
      axios
        .get(`/api/v1/ws/account/${accountId}`)
        .then((res) => res.data as AccountType),
    enabled: !!session?.user && !!accountId,
  });

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company"],
    queryFn: () =>
      axios.get(`/api/v1/ws/company`).then((res) => res.data as CompanyType),
  });

  // filter by dates and other if exist
  const filterByDates = (value: RangeValue) => {
    let newFilteredData: TransactionType[] | undefined = [];

    if (
      typeof value !== "undefined" &&
      (!isNull(value?.[0]) || !isNull(value?.[1]))
    ) {
      newFilteredData = data?.filter((item) =>
        dayjs(item?.date).isBetween(value?.[0], value?.[1], "dates", "[]")
      );
    } else {
      newFilteredData = data;
    }
    setDatesFilterValue(value);
    setSelectedCurrentData(newFilteredData);
  };

  useEffect(() => {
    setSelectedCurrentData(data);
  }, [data]);
  return (
    <div>
      <header className="min-h-[64px] flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 mb-4 lg:mb-0 ">
        <div className="flex-1 hidden lg:block" />
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
            disabled={!showFilter}
          />
        </div>

        <Space align="end">
          <Button
            icon={<FilterOutlined />}
            className={cn("shadow-none", showFilter ? "hidden" : "block")}
            onClick={() => {
              setShowFilter(true);
            }}
            disabled={isLoading}
            type="link"
          >
            Filtrer par date
          </Button>
          <Button
            className={cn(" shadow-none", showFilter ? "block" : "hidden")}
            icon={<CloseOutlined />}
            type="text"
            onClick={() => {
              setDatesFilterValue(undefined);
              setSelectedCurrentData(data);
              setShowFilter(false);
            }}
            danger
            disabled={isLoading}
          >
            Effacer filtres
          </Button>
          <ReactToPrint
            key="1"
            trigger={() => (
              <Button
                disabled={isLoading}
                icon={<PrinterOutlined />}
                type="primary"
                ghost
                className="shadow-none"
              >
                Imprimer
              </Button>
            )}
            content={() => refComponentToPrint.current}
            documentTitle={`F${account?.accountNumber}${dayjs().format(
              "DDMMYYYYHHmmss"
            )}`}
          />
          ,
        </Space>
      </header>
      <TransactionsList data={selectedCurrentData} isLoading={isLoading} />

      {/* To print */}
      <div className=" hidden">
        <div ref={refComponentToPrint}>
          <div className="flex items-end space-x-4 font-black">
            <Image
              src={company?.logo}
              alt=""
              height={58}
              width={58}
              preview={false}
            />{" "}
            <h6>{company?.name?.toUpperCase()}</h6>
          </div>
          <ProCard
            title={`FICHE ${account?.accountNumber}`}
            bordered
            style={{ marginBlockEnd: 16, marginBlockStart: 32 }}
            // extra={[
            //   <Tag key="1" className="mr-0 uppercase" bordered={false}>
            //     {getInOrOutType(data?.type)}
            //   </Tag>,
            // ]}
          >
            <ProDescriptions emptyText="" column={1}>
              <ProDescriptions.Item
                label=""
                render={() => (
                  <Space>
                    <Avatar
                      style={{
                        backgroundColor: getHSLColor(
                          `${account?.owner.firstName} ${account?.owner.lastName} ${account?.owner.surname}`
                        ),
                      }}
                    >
                      {account?.owner.firstName?.charAt(0).toUpperCase()}
                      {account?.owner.lastName?.charAt(0).toUpperCase()}
                    </Avatar>
                    {`${account?.owner?.firstName.toUpperCase()} ${account?.owner?.lastName.toUpperCase()} ${account?.owner?.surname.toUpperCase()}`}
                  </Space>
                )}
              >
                {account?.owner?.firstName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Relevé de compte">
                {typeof datesFilterValue !== "undefined" &&
                (!isNull(datesFilterValue?.[0]) ||
                  !isNull(datesFilterValue?.[1]))
                  ? `Du ${dayjs(datesFilterValue?.[0]).format(
                      "DD/MM/YYYY"
                    )} au ${dayjs(datesFilterValue?.[1]).format("DD/MM/YYYY")}`
                  : "Dépuis la création"}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
          <div></div>
          <TransactionsListToPrint data={selectedCurrentData} />
        </div>
      </div>
    </div>
  );
};
