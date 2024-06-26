import * as Yup from "yup";

import {
  stockColumns,
  stockBrandColumns,
  stockCategoryColumns,
} from "../table/columns/_columns";


const selectAdaptor = (data) =>
  Array.isArray(data)
    ? data.map(({ id, name }) => ({ label: name, value: id }))
    : [];
const selectInitializer = (data) => data?.[0]?.value;
const multiSelectInitializer = (data) => [data?.[0]?.value];

export const fullData = {
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
          props: {
            imagestyle: { minHeight: "150px", maxHeight: "200px" },
          },
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
        col: 6,
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
  "stock-category": {
    pageTitle: "商品類別維護",
    searchPlaceholder: "類別",
    createHeaderText: "類別資料",
    column: stockCategoryColumns,
    inputList: [
      [
        {
          type: "text",
          label: "類別名稱",
          required: true,
          name: "name",
          col: 6,
        },
        [
          [
            {
              type: "label-holder",
            },
            {
              type: "switch",
              label: "是否為精選分類",
              name: "is_recommended",
              col: 5,
              props: {
                inline: true
              }
            },
            {
              type: "label-holder",
              col: 5
            },
          ],
        ],
      ],
      {
        type: "image",
        label: "精選分類縮圖",
        name: "recommended_image",
        col: 6,
      },
      {
        type: "textarea",
        label: "備註",
        name: "description",
      },
    ],
    fetchUrl: "stock-category",
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(2, "至少 2 個字")
        .max(15, "至多 15 個字")
        .required("此欄位必填"),
      recommended_image: Yup.mixed().when("is_recommended", {
        is: true,
        then: () => Yup.mixed().required("精選分類請提供縮圖"),
      }).nullable(true),
    }),
    formField: {
      name: "",
      description: "",
      is_recommended: false,
      recommended_image: null,
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
