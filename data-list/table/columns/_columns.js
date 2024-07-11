import { ActionsCell } from "./ActionsCell";
import { UserCustomHeader } from "./UserCustomHeader";
import { ColorsCell } from "./ColorsCell";
import { ColorSchemeCell } from "./ColorSchemeCell";
import { AvaliableCell } from "./AvaliableCell";

const EnableCell = ({ status }) => (
  <AvaliableCell status={status} validText="啟用中" inValidText="未啟用" />
);

const ValiableCell = ({ status }) => (
  <AvaliableCell status={status} validText="已上架" inValidText="未上架" />
);

const BinaryCell = ({ status }) => (
  <AvaliableCell
    status={status}
    validText="是"
    inValidText="否"
    className={"px-3"}
  />
);

export const placeHolderColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="啟用狀態"
        className="min-w-125px"
      />
    ),
    id: "enable",
    Cell: ({ ...props }) => (
      <EnableCell status={props.data[props.row.index].enable} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="編號"
        className="min-w-125px"
      />
    ),
    accessor: "code",
  },
];

export const stockColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="上架狀態"
        className="min-w-125px"
      />
    ),
    id: "is_valid",
    Cell: ({ ...props }) => (
      <ValiableCell status={props.data[props.row.index].is_valid} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="是否為預購商品"
        className="min-w-125px"
      />
    ),
    id: "is_preorder",
    Cell: ({ ...props }) => (
      <BinaryCell status={props.data[props.row.index].is_preorder} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="負庫存銷售"
        className="min-w-125px"
      />
    ),
    id: "is_nostock_sell",
    Cell: ({ ...props }) => (
      <BinaryCell status={props.data[props.row.index].is_nostock_sell} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="是否為獨立揀貨"
        className="min-w-125px"
      />
    ),
    id: "is_independent",
    Cell: ({ ...props }) => (
      <BinaryCell status={props.data[props.row.index].is_independent} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品編號"
        className="min-w-125px"
      />
    ),
    accessor: "code",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品條碼"
        className="min-w-125px"
      />
    ),
    accessor: "barcode",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品規格"
        className="min-w-125px"
      />
    ),
    accessor: "specification",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品品牌"
        className="min-w-125px"
      />
    ),
    accessor: "brand",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品類別"
        className="min-w-125px"
      />
    ),
    accessor: "category",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="記帳分類"
        className="min-w-125px"
      />
    ),
    accessor: "accounting",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="供應商"
        className="min-w-125px"
      />
    ),
    accessor: "supplier",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="最少訂購數"
        className="min-w-125px"
      />
    ),
    accessor: "min_order",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="訂購倍數"
        className="min-w-125px"
      />
    ),
    accessor: "order_step",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="售價"
        className="min-w-125px"
      />
    ),
    accessor: "price",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="進貨價"
        className="min-w-125px"
      />
    ),
    accessor: "purchase_price",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="預購商品庫存"
        className="min-w-125px"
      />
    ),
    accessor: "preorder_count",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const stockBrandColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="品牌名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const stockCategoryColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="類別名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const stockAccountsColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="類別名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="排序位置"
        className="min-w-125px"
      />
    ),
    accessor: "sorting",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="類別代號"
        className="min-w-125px"
      />
    ),
    accessor: "code",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const supplierColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="供應商名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="供應商編號"
        className="min-w-125px"
      />
    ),
    accessor: "code",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="付款方式"
        className="min-w-125px"
      />
    ),
    accessor: "payment",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="結帳方式"
        className="min-w-125px"
      />
    ),
    accessor: "accounting",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="統一編號"
        className="min-w-125px"
      />
    ),
    accessor: "uniform_number",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="聯絡電話"
        className="min-w-125px"
      />
    ),
    accessor: "phone",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="聯絡地址"
        className="min-w-125px"
      />
    ),
    accessor: "contact_address",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="聯絡人"
        className="min-w-125px"
      />
    ),
    accessor: "contact_person",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="聯絡人電話"
        className="min-w-125px"
      />
    ),
    accessor: "mobile",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const memberGradeColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="等級名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const memberRoleColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="角色名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const memberManagementColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="狀態"
        className="min-w-125px"
      />
    ),
    accessor: "status",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="會員名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="會員編號"
        className="min-w-125px"
      />
    ),
    accessor: "code",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="會員帳號"
        className="min-w-125px"
      />
    ),
    accessor: "account",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="會員密碼"
        className="min-w-125px"
      />
    ),
    accessor: "password",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="會員等級"
        className="min-w-125px"
      />
    ),
    accessor: "grade",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="會員身分別"
        className="min-w-125px"
      />
    ),
    accessor: "identity",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="會員付款方式"
        className="min-w-125px"
      />
    ),
    accessor: "payment",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="統一編號"
        className="min-w-125px"
      />
    ),
    accessor: "uniform_number",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="公司抬頭"
        className="min-w-125px"
      />
    ),
    accessor: "company_title",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="出貨方式"
        className="min-w-125px"
      />
    ),
    accessor: "shipping_method",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="發貨條件"
        className="min-w-125px"
      />
    ),
    accessor: "shipping_condition",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="聯絡電話"
        className="min-w-125px"
      />
    ),
    accessor: "phone",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="生日(非必填)"
        className="min-w-125px"
      />
    ),
    accessor: "birthday",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="聯絡地址"
        className="min-w-125px"
      />
    ),
    accessor: "address",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const memberTagColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="標籤名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const memberPaymentColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="付款方式名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const inventoryManagementColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="盤點單號"
        className="min-w-125px"
      />
    ),
    accessor: "number",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="盤點日期"
        className="min-w-125px"
      />
    ),
    accessor: "date",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="盤點倉別"
        className="min-w-125px"
      />
    ),
    accessor: "category",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="盤點儲位"
        className="min-w-125px"
      />
    ),
    accessor: "storage",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="狀態"
        className="min-w-125px"
      />
    ),
    accessor: "status",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const inventoryTransferColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="出庫倉別"
        className="min-w-125px"
      />
    ),
    accessor: "out_warehouse_category",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="出庫儲位"
        className="min-w-125px"
      />
    ),
    accessor: "out_warehouse_storage",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="入庫倉別"
        className="min-w-125px"
      />
    ),
    accessor: "warehouse_Category",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="是否已執行出庫"
        className="min-w-125px"
      />
    ),
    accessor: "is_out_warehouse",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="調撥單號"
        className="min-w-125px"
      />
    ),
    accessor: "transfer_number",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];

export const orderCategoryColumns = [
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="操作"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="類別名稱"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="備註"
        className="min-w-125px"
      />
    ),
    accessor: "description",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="創建時間"
        className="min-w-125px"
      />
    ),
    accessor: "create_time",
  },
];
