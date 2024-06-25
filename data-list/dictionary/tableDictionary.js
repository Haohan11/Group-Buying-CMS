import * as Yup from "yup";

import {
  stockColumns,
  stockBrandColumns,
  seriesColumns,
  colorSchemeColumns,
  designColumns,
  materialColumns,
  supplierColumns,
  accountsColumns,
  roleColumns,
  environmentColumns,
  colorColumns,
} from "../table/columns/_columns";

const enable_label = "啟用狀態";
const comment_label = "備註";

const selectAdaptor = (data) =>
  Array.isArray(data)
    ? data.map(({ id, name }) => ({ label: name, value: id }))
    : [];
const selectInitializer = (data) => data[0].value;
const multiSelectInitializer = (data) => [data[0].value];

export const fullData = {
  // -&anchor
  "stock-management": {
    pageTitle: "商品維護",
    searchPlaceholder: "商品",
    createHeaderText: "商品資料",
    column: stockColumns,
    inputList: [
      [
        {
          type: "image",
          label: "商品封面照",
          required: true,
          name: "cover",
        },
        [
          {
            type: "label-holder",
          },
          {
            type: "switch",
            label: "商品是否上架",
            name: "enable",
            col: 12,
          },
          {
            type: "switch",
            label: "是否為預購商品",
            name: "is_preorder",
            col: 12,
          },
          {
            type: "switch",
            label: "負庫存銷售",
            name: "allow_nostock_sell",
            col: 12,
          },
          {
            type: "switch",
            label: "是否為獨立揀貨",
            name: "is_independent",
            col: 12,
          },
          ,
        ],
      ],
      [
        {
          type: "multi-image",
          label: "商品圖片",
          name: "stock-images",
        },
      ],
      [
        {
          type: "text",
          label: "商品名稱",
          required: true,
          name: "name",
        },
        {
          type: "text",
          label: "商品編號",
          required: true,
          name: "code",
        },
      ],
      [
        {
          type: "text",
          label: "商品條碼",
          required: true,
          name: "bar_code",
        },
        {
          type: "text",
          label: "商品規格",
          name: "specification",
        },
      ],
      [
        {
          type: "select",
          label: "商品品牌",
          name: "brand",
        },
        {
          type: "select",
          label: "商品類別",
          name: "category",
        },
      ],
      [
        {
          type: "select",
          label: "供應商",
          name: "supplier",
        },
        {
          type: "multi-select",
          label: "記帳分類",
          name: "accounting",
        },
      ],
      [
        {
          type: "number",
          label: "最少訂購數",
          name: "min_order",
        },
        {
          type: "number",
          label: "訂購倍數",
          name: "order_step",
        },
      ],
      [
        {
          type: "number",
          label: "預購商品庫存",
          name: "preorder_count",
        },
        {
          type: "number",
          label: "售價",
          name: "price",
        },
        {
          type: "number",
          label: "進貨價",
          name: "purchase_price",
        },
      ],
      {
        type: "price-table",
        label: "會員等級定價",
        name: "grade_price",
        required: true,
      },
      {
        type: "price-table",
        label: "身分別定價",
        name: "role_price",
        required: true,
      },
      {
        type: "editor",
        label: "商品介紹",
        name: "introduction",
      },
    ],
    preLoad: [
      {
        name: "category",
        fetchUrl: "stock-category",
        adaptor: selectAdaptor,
        initializer: selectInitializer,
      },
      {
        name: "supplier",
        fetchUrl: "supplier",
        adaptor: selectAdaptor,
        initializer: selectInitializer,
      },
      {
        name: "accounting",
        fetchUrl: "accounting",
        adaptor: selectAdaptor,
        initializer: multiSelectInitializer,
      },
      {
        name: "grade_price",
        fetchUrl: "grade-price",
      },
      {
        name: "role_price",
        fetchUrl: "role-price",
      },
      {
        name: "brand",
        fetchUrl: "stock-brand",
        adaptor: selectAdaptor,
        initializer: selectInitializer,
      },
    ],
    fetchUrl: "stock",
    validationSchema: Yup.object().shape({}),
    formField: {
      preorder_count: "",
      price: "",
    },
  },
  "stock-tag": {
    pageTitle: "商品維護",
    searchPlaceholder: "商品",
    createHeaderText: "商品資料",
    column: stockColumns,
    modalConfig: {
      avatar: false,
      name_label: "商品樣式",
      name_placeholder: "請輸入商品樣式",
      name_required: true,
      code_label: "商品型號",
      code_required: true,
      code_placeholder: "請輸入商品型號",
      supplier_label: "供應廠商",
      enable_label: "上架狀態",
      series_label: "商品系列",
      color_label: "商品顏色",
      color_placeholder: "輸入商品顏色名稱",
      material_label: "面料材質",
      design_label: "商品風格",
      absorption_label: "吸音效果",
      block_label: "遮光效果",
      description_label: "商品描述",
    },
    fetchUrl: "stock",
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(2, "至少 2 個字")
        .max(15, "至多 15 個字")
        .required("此欄位必填"),
      series: Yup.string().required(),
      code: Yup.string().max(15, "至多 15 個字").required("此欄位必填"),
    }),
    formField: {
      name: "",
      code: "",
      enable: true,
      series: "",
      supplier: "",
      material: [],
      design: [],
      absorption: 1,
      block: 1,
      description: "",
      environment: [],
      colorImages: [],
    },
  },
  "stock-brand": {
    pageTitle: "商品品牌維護",
    searchPlaceholder: "品牌",
    createHeaderText: "品牌資料",
    column: stockBrandColumns,
    inputList: [
      {
        type: "text",
        label: "品牌名稱",
        required: true,
        name: "name",
        col: 6
      },
      {
        type: "textarea",
        label: "備註",
        name: "description",
      },
    ],
    fetchUrl: "stock-brand",
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(2, "至少 2 個字")
        .max(15, "至多 15 個字")
        .required("此欄位必填"),
    }),
    formField: {
      name: "",
      description: "",
    },
  },
};

const ArrangeWithProperty = Object.entries(fullData).reduce(
  (tableDict, [table, content]) => {
    Object.entries(content).reduce((dict, [key, value]) => {
      dict[key] === undefined && (dict[key] = {});
      dict[key][table] = value;
      return dict;
    }, tableDict);
    return tableDict;
  },
  {}
);

export default ArrangeWithProperty;
