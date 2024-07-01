import { ActionsCell } from "./ActionsCell";
import { UserCustomHeader } from "./UserCustomHeader";
import { ColorsCell } from "./ColorsCell";
import { ColorSchemeCell } from "./ColorSchemeCell";
import { EnableCell } from "./enableCell";
import { ProductAvaliableCell } from "./ProductAvaliableCell";

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
      <ProductAvaliableCell enable={props.data[props.row.index].enable} />
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
    id: "enable",
    Cell: ({ ...props }) => (
      <ProductAvaliableCell enable={props.data[props.row.index].enable} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品型號"
        className="min-w-125px"
      />
    ),
    accessor: "code",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品樣式"
        className="min-w-125px"
      />
    ),
    accessor: "name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品系列"
        className="min-w-125px"
      />
    ),
    accessor: "series.name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="供應商"
        className="min-w-125px"
      />
    ),
    accessor: "supplier.name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品顏色"
        className="min-w-125px"
      />
    ),
    id: "colors",
    Cell: ({ ...props }) => (
      <ColorsCell colorList={props.data[props.row.index].colorList} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="色系類別"
        className="min-w-125px"
      />
    ),
    accessor: "colorScheme",
    Cell: ({ ...props }) => (
      <ColorSchemeCell colorScheme={props.data[props.row.index].colorScheme} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="面料材質"
        className="min-w-125px"
      />
    ),
    accessor: "material",
    Cell: ({ ...props }) => (
      <ColorSchemeCell colorScheme={props.data[props.row.index].material} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品風格"
        className="min-w-125px"
      />
    ),
    accessor: "design",
    Cell: ({ ...props }) => (
      <ColorSchemeCell colorScheme={props.data[props.row.index].design} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="遮光效果"
        className="min-w-125px"
      />
    ),
    accessor: "block",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="吸音效果"
        className="min-w-125px"
      />
    ),
    accessor: "absorption",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="商品描述"
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
