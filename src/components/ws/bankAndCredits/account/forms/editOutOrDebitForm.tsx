"use client";

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Select,
  Space,
  message,
} from "antd";
import { Dispatch, SetStateAction } from "react";
import dayjs from "dayjs";
import {
  CheckOutlined,
  DollarOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  AccountType,
  TransactionType,
  TransactionTypeType,
} from "@/lib/types/index.d";
import { useParams } from "next/navigation";
import { getAccountsAsOptions, getTransactionTitle } from "@/lib/utils";

type DebitFormData = {
  type: TransactionTypeType;
  amount: string;
  message?: string;
  date: string;
  receiverAccountId?: number;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  accounts?: AccountType[];
  isLoadingAccounts: boolean;
  currentAccountId?: number;
  transactionData?: TransactionType;
  triggerRightSider?: Dispatch<SetStateAction<boolean>>;
};

export const EditOutOrDebitForm: React.FC<Props> = ({
  open,
  toggle,
  accounts,
  isLoadingAccounts,
  currentAccountId,
  transactionData,
  triggerRightSider
}) => {
  const [form] = Form.useForm();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { accountId } = useParams();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.put(
        `/api/v1/ws/account/${accountId}/transaction/${transactionData?.id}`,
        data
      ),
  });

  const otherAccounts = () => {
    const items = accounts?.filter((item) => item.id !== currentAccountId);
    return items;
  };

  const submit = (formData: DebitFormData) => {
    const data = {
      title: getTransactionTitle(formData.type),
      amount: parseFloat(formData.amount),
      //   type: formData.type,
      message: formData.message,
      date: formData.date,
      receiverAccountId: formData.receiverAccountId,
      operatorId: session?.user.id,
    };
    mutate(data, {
      onSuccess: (res) => {
        if (res.data) {
          message.success({
            content: "Opération effectuée",
            icon: <CheckOutlined />,
          });
          form.resetFields();
          toggleForm();
          triggerRightSider?.(false)
          queryClient.invalidateQueries({
            queryKey: ["transactions", accountId],
          });
          queryClient.invalidateQueries({ queryKey: ["account", accountId] });
        }
      },
      onError: () => {
        message.error({
          content: "Oops! Une erreur s'est produite, Veuillez réessayer!",
        });
      },
    });
  };

  return (
    <Modal
      centered
      title={<div className="">Modification sortie (Décaissement)</div>}
      open={open}
      footer={null}
      onCancel={toggleForm}
      closable={!isPending}
      maskClosable={!isPending}
    >
      <Form
        form={form}
        layout="horizontal"
        // requiredMark="optional"
        className=" pt-3 w-full"
        onReset={toggleForm}
        initialValues={{ type: transactionData?.type,
          amount: transactionData?.amount,
          message: transactionData?.message,
          date: dayjs(transactionData?.date),
           }}
        onFinish={submit}
        disabled={isPending}
      >
        <Layout className="bg-white">
          <Layout.Content>
            <Form.Item
              name="type"
              label="Type de sortie"
              rules={[{ required: true }]}
            >
              <Select
                disabled
                bordered={false}
                showSearch
                placeholder="Sélectionner un type"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  `${option?.label}`.toLowerCase().includes(input.toLowerCase())
                }
                menuItemSelectedIcon={<CheckOutlined />}
                options={[
                  {
                    value: "WITHDRAWAL",
                    label: "Retrait d'argent sur le compte",
                  },
                  {
                    value: "LOAN_DISBURSEMENT",
                    label: "Décaissement de crédit",
                  },
                  {
                    value: "TRANSFER",
                    label: "Virement (Transfert vers autre compte)",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.type !== currentValues.type
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("type") === "TRANSFER" ? (
                  <Form.Item
                    name="receiverAccountId"
                    label="Bénéficiaire"
                    rules={[{ required: true }]}
                  >
                    <Select
                      showSearch
                      loading={isLoadingAccounts}
                      placeholder="Sélectionner un compte"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (String(option?.label).toLowerCase() ?? "").includes(
                          input.toLowerCase()
                        )
                      }
                      filterSort={(optionA, optionB) =>
                        (String(optionA?.label) ?? "")
                          .toLowerCase()
                          .localeCompare(
                            (String(optionB?.label) ?? "").toLowerCase()
                          )
                      }
                      options={getAccountsAsOptions(otherAccounts())}
                    />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
            <div className="flex items-end">
              <Form.Item
                name="amount"
                label="Montant"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className=" bg-white w-40"
                  min={0.01}
                  step={0.01}
                  controls={true}
                  stringMode={true}
                  suffix={<DollarOutlined />}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="date"
              label="Date de décaissement"
              rules={[{ required: true }]}
            >
              <DatePicker
                showTime
                className=" bg-white"
                placeholder="sélectionner une date"
                format="DD/MM/YYYY HH:mm:ss"
              />
            </Form.Item>

            <Form.Item
              name="message"
              label="Mémo (Observation)"
              rules={[
                { required: false },
                {
                  whitespace: true,
                  message: "Pas uniquement des espaces vide svp!",
                },
              ]}
            >
              <Input.TextArea className=" bg-white" />
            </Form.Item>
          </Layout.Content>
          <Layout.Footer
            style={{
              display: "flex",
              justifyContent: "end",
              borderTop: "1px solid #f0f0f0",
              borderRadius: "0 0 10px 10px",
              backgroundColor: "#fff",
              padding: "14px 0 0 0",
            }}
          >
            <Space>
              <Button htmlType="reset">Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="shadow-none"
                icon={isPending ? <LoadingOutlined /> : undefined}
              >
                Enregistrer
              </Button>
            </Space>
          </Layout.Footer>
        </Layout>
      </Form>
    </Modal>
  );
};
