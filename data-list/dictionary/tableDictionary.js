import * as Yup from "yup";
import { getCurrentTime, transImageUrl, replaceBackendUrl } from "@/tool/helper";

import {
  placeHolderColumns,
  stockColumns,
  stockBrandColumns,
  stockCategoryColumns,
  stockAccountsColumns,
  supplierColumns,
  memberLevelColumns,
  memberRoleColumns,
  memberManagementColumns,
  memberPaymentColumns,
  memberShippingColumns,
  inventoryManagementColumns,
  inventoryTransferColumns,
  orderCategoryColumns,
  saleColumns,
} from "../table/columns/_columns";

/** Usage of tableDictionary:
 *
 *  preload (Data control):
 *    Fetch the required data, and will cached by use `name` and `fetchUrl` as key.
 *
 *  adaptor (UI render):
 *    Use for preload data adapt,
 *    which is use for render your ui like select option or table content.
 *
 *  createInitor (Data control):
 *    Use for initalize formik data from preload data (not adapt yet) in create mode.
 *
 *  editAdaptor (Data control):
 *    Use for adapt data for formik initialValue in edit mode.
 *
 *  submitAdaptor (Data control):
 *    Use for adapt data before submit.
 *    @param {Object} data
 *    @param {String} currentMode
 *    @returns {Object}
 */

const selectAdaptor = (data) =>
  Array.isArray(data)
    ? data.map(({ id, name }) => ({ label: name, value: `${id}` }))
    : [];
const selectInitializer = (data) => (data?.[0]?.id ? `${data[0].id}` : null);

export const dictionary = {
  "stock-management": {
    pageTitle: "商品維護",
    searchPlaceholder: "商品",
    createHeaderText: "商品資料",
    editHeaderText: "商品資料",
    column: stockColumns,
    inputList: [
      [
        {
          type: "image",
          label: "商品封面照",
          required: true,
          name: "cover_image",
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
            name: "is_valid",
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
            name: "is_nostock_sell",
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
          name: "stock_image",
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
          name: "barcode",
        },
        {
          type: "text",
          label: "商品規格",
          required: true,
          name: "specification",
        },
      ],
      [
        {
          type: "select",
          label: "商品品牌",
          name: "stock_brand_id",
          required: true,
        },
        {
          type: "select",
          label: "商品類別",
          name: "stock_category_id",
          required: true,
        },
      ],
      [
        {
          type: "select",
          label: "記帳分類",
          name: "accounting_id",
          required: true,
        },
        {
          type: "select",
          label: "供應商",
          name: "supplier_id",
          required: true,
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
          label: "售價",
          name: "price",
          required: true,
        },
        {
          type: "number",
          label: "進貨價",
          name: "purchase_price",
          required: true,
        },
        {
          type: "number",
          label: "預購商品庫存",
          name: "preorder_count",
        },
      ],
      {
        type: "price-table",
        label: "會員等級定價",
        name: "level_price",
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
      {
        type: "textarea",
        label: "簡介",
        name: "short_desc",
      },
      {
        type: "textarea",
        label: "備註",
        name: "description",
      },
    ],
    preLoad: [
      {
        name: "stock_category_id",
        fetchUrl: "stock-category",
        adaptor: selectAdaptor,
        createInitor: selectInitializer,
      },
      {
        name: "supplier_id",
        fetchUrl: "supplier",
        adaptor: selectAdaptor,
        createInitor: selectInitializer,
      },
      {
        name: "accounting_id",
        fetchUrl: "stock-accounting",
        adaptor: selectAdaptor,
        createInitor: selectInitializer,
      },
      {
        name: "level_price",
        fetchUrl: "member-level",
        adaptor: (data) =>
          data.map(({ name, id }) => ({
            name,
            id: `${id}`,
          })),
        createInitor: (data) =>
          data.map(({ id }) => ({ id: `${id}`, price: "" })),
      },
      {
        name: "role_price",
        fetchUrl: "member-role",
        adaptor: (data) =>
          data.map(({ name, id }) => ({
            name,
            id: `${id}`,
          })),
        createInitor: (data) =>
          data.map(({ id }) => ({ id: `${id}`, price: "" })),
      },
      {
        name: "stock_brand_id",
        fetchUrl: "stock-brand",
        adaptor: selectAdaptor,
        createInitor: selectInitializer,
      },
    ],
    fetchUrl: "stock-backend",
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(2, "至少 2 個字")
        .max(35, "至多 35 個字")
        .required("此欄位必填"),
      code: Yup.string()
        .min(2, "至少 2 個字")
        .max(35, "至多 35 個字")
        .required("此欄位必填"),
      barcode: Yup.string()
        .min(2, "至少 2 個字")
        .max(35, "至多 35 個字")
        .required("此欄位必填"),
      cover_image: Yup.mixed().required("請提供商品封面圖"),
      specification: Yup.string().required("此欄位必填"),
      price: Yup.number().typeError("只能輸入數字").required("此欄位必填"),
      purchase_price: Yup.number()
        .typeError("只能輸入數字")
        .required("此欄位必填"),
      // stock_image
      // stock_image_preview
      // stock_image_persist
      preorder_count: Yup.number().typeError("只能輸入數字"),
      level_price: Yup.mixed().test({
        test: (data) => !data.some(({ price }) => !/^[1-9][0-9]*$/.test(price)),
        message: "請提供價錢",
      }),
      role_price: Yup.mixed().test({
        test: (data) => !data.some(({ price }) => !/^[1-9][0-9]*$/.test(price)),
        message: "請提供價錢",
      }),
      stock_brand_id: Yup.string().required("此欄位必填"),
      stock_category_id: Yup.string().required("此欄位必填"),
      accounting_id: Yup.string().required("此欄位必填"),
      supplier_id: Yup.string().required("此欄位必填"),
    }),
    formField: {
      cover_image: null,
      stock_image: null,
      stock_image_preview: null,
      is_valid: true,
      is_preorder: false,
      is_nostock_sell: false,
      is_independent: false,
      name: "",
      code: "",
      barcode: "",
      specification: "",
      stock_brand_id: null,
      stock_category_id: null,
      accounting_id: null,
      supplier_id: null,
      min_order: 1,
      order_step: 1,
      price: "",
      preorder_count: 0,
      purchase_price: "",
      level_price: null,
      role_price: null,
      introduction: "",
      short_desc: "",
      description: "",
    },
    editAdaptor: (data) => {
      const { stock_image_preview = [], stock_image_persist = [] } =
        Array.isArray(data.stock_image_preview)
          ? data.stock_image_preview.reduce(
              (dict, url) => ({
                stock_image_preview: dict.stock_image_preview.concat({
                  id: url,
                  src: transImageUrl(url),
                }),
                stock_image_persist: dict.stock_image_persist.concat(url),
              }),
              { stock_image_preview: [], stock_image_persist: [] }
            )
          : {};

      /** adapt image path in introduction and save original path to persist */
      const introduction_image_persist = [];
      const introduction =
        typeof data.introduction === "string"
          ? data.introduction.replaceAll(/src="path:(.*?)"/g, (sub) => {
              introduction_image_persist.push(
                sub.slice(10, -1).replaceAll("\\", "/")
              );
              return `src="${transImageUrl(sub.slice(10, -1))}"`;
            })
          : "";

      return {
        ...data,
        stock_image_preview,
        stock_image_persist,
        introduction,
        introduction_image_persist,
      };
    },
    submitAdaptor: (data) => ({
      ...data,
      introduction: replaceBackendUrl(data.introduction, "path:"),
      preorder_count: data.preorder_count || 0,
    }),
  },
  "stock-brand": {
    pageTitle: "商品品牌維護",
    searchPlaceholder: "品牌",
    createHeaderText: "品牌資料",
    editHeaderText: "品牌資料",
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
    editHeaderText: "類別資料",
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
                inline: true,
              },
            },
            {
              type: "label-holder",
              col: 5,
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
      recommended_image: Yup.mixed()
        .when("is_recommended", {
          is: true,
          then: () => Yup.mixed().required("精選分類請提供縮圖"),
        })
        .nullable(true),
    }),
    formField: {
      name: "",
      description: "",
      is_recommended: false,
      recommended_image: null,
    },
  },
  "stock-accounting": {
    pageTitle: "記帳分類維護",
    searchPlaceholder: "記帳分類",
    createHeaderText: "記帳分類",
    editHeaderText: "記帳分類",
    column: stockAccountsColumns,
    inputList: [
      [
        {
          type: "text",
          label: "類別名稱",
          required: true,
          name: "name",
        },
        {
          type: "text",
          label: "類別代號",
          required: true,
          name: "code",
        },
      ],
      {
        type: "number",
        label: "排序位置",
        name: "sorting",
        col: 6,
      },
      {
        type: "textarea",
        label: "備註",
        name: "description",
      },
    ],
    fetchUrl: "stock-accounting",
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(1, "至少 1 個字")
        .max(35, "至多 35 個字")
        .required("此欄位必填"),
      code: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "僅限輸入英數字")
        .required("此欄位必填"),
      sorting: Yup.string().matches(/^[0-9]+$/, "僅限輸入數字"),
    }),
    formField: {
      name: "",
      sorting: 1,
      code: "",
      description: "",
    },
  },
  "purchase-supplier": {
    pageTitle: "供應商管理",
    searchPlaceholder: "供應商",
    createHeaderText: "供應商",
    editHeaderText: "供應商",
    column: supplierColumns,
    inputList: [
      [
        {
          type: "text",
          label: "供應商名稱",
          required: true,
          name: "name",
        },
        {
          type: "text",
          label: "供應商編號",
          required: true,
          name: "code",
        },
      ],
      [
        {
          type: "select",
          label: "付款方式",
          name: "payment_id",
        },
        {
          type: "select",
          label: "結帳方式",
          name: "accounting_id",
        },
      ],
      [
        {
          type: "number",
          label: "統一編號",
          name: "uniform_number",
        },
        {
          type: "text",
          label: "聯絡人",
          name: "contact_person",
        },
      ],
      {
        type: "text",
        label: "聯絡地址",
        name: "contact_address",
      },
      [
        {
          type: "number",
          label: "聯絡人電話",
          name: "mobile",
        },
        {
          type: "number",
          label: "聯絡電話",
          name: "phone",
        },
      ],
      {
        type: "textarea",
        label: "備註",
        name: "description",
      },
    ],
    preLoad: [
      {
        name: "payment_id",
        fetchUrl: "supplier-payment",
        adaptor: selectAdaptor,
        createInitor: selectInitializer,
      },
      {
        name: "accounting_id",
        fetchUrl: "account-method",
        adaptor: selectAdaptor,
        createInitor: selectInitializer,
      },
    ],
    fetchUrl: "supplier",
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(1, "至少 1 個字")
        .max(35, "至多 35 個字")
        .required("此欄位必填"),
      code: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "僅限輸入英數字")
        .required("此欄位必填"),
      uniform_number: Yup.string().matches(/^[0-9]{8}$/, "統一編號格式錯誤"),
      mobile: Yup.string()
        .min(8, "電話格式錯誤")
        .max(10, "電話格式錯誤")
        .matches(/^[0-9]+$/, "電話格式錯誤"),
      phone: Yup.string()
        .min(8, "電話格式錯誤")
        .max(10, "電話格式錯誤")
        .matches(/^[0-9]+$/, "電話格式錯誤"),
    }),
    formField: {
      name: "",
      code: "",
      description: "",
      payment_id: null,
      accounting_id: null,
      uniform_number: "",
      mobile: "",
      phone: "",
      contact_address: "",
      contact_person: "",
    },
  },
  "member-management": {
    pageTitle: "會員",
    searchPlaceholder: "會員",
    createHeaderText: "會員",
    editHeaderText: "會員",
    column: memberManagementColumns,
    inputList: [
      [
        {
          type: "select",
          label: "狀態",
          required: true,
          name: "status_id",
          col: 4,
          props: {
            options: [
              {
                label: "申請中",
                value: "applying",
              },
              {
                label: "已啟用",
                value: "enabled",
              },
              {
                label: "已停用",
                value: "disabled",
              },
            ],
            defaultValue: {
              label: "申請中",
              value: "applying",
            },
          },
        },
        { type: "text-holder", col: 2 },
        {
          type: "plain",
          label: "會員編號",
          name: "code",
        },
      ],
      [
        {
          type: "text",
          label: "會員名稱",
          required: true,
          name: "name",
          props: {
            placeholder: "輸入會員姓名",
          },
        },
        {
          type: "text",
          label: "電子郵件",
          name: "email",
          props: {
            placeholder: "輸入電子郵件",
          },
        },
      ],
      [
        {
          type: "text",
          label: "會員帳號",
          required: true,
          name: "account",
          props: {
            placeholder: "輸入會員帳號",
          },
        },
        {
          type: "password",
          label: "會員密碼",
          required: true,
          name: "password",
          props: {
            placeholder: "輸入會員密碼",
          },
        },
      ],
      [
        {
          type: "select",
          label: "會員等級",
          required: true,
          name: "member_level_id",
        },
        {
          type: "select",
          label: "會員身分別",
          required: true,
          name: "member_role_id",
        },
      ],
      [
        {
          type: "number",
          label: "聯絡電話",
          required: true,
          name: "phone",
          props: {
            placeholder: "輸入聯絡電話",
          },
        },
        {
          type: "select",
          label: "出貨方式",
          required: true,
          name: "shipping_id",
        },
      ],
      [
        {
          type: "text",
          label: "公司抬頭",
          required: false,
          name: "company_title",
          props: {
            placeholder: "輸入公司抬頭",
          },
        },
        {
          type: "text",
          label: "統一編號",
          required: false,
          name: "uniform_number",
          props: {
            placeholder: "輸入統一編號",
          },
        },
      ],
      [
        {
          type: "select",
          label: "付款方式",
          required: false,
          name: "payment_id",
        },
        {
          type: "select",
          label: "發貨條件",
          required: true,
          name: "shipping_condition_id",
          props: {
            options: [
              {
                label: "先付款後取貨",
                value: "prepaid",
              },
              {
                label: "先取貨後付款",
                value: "postpaid",
              },
            ],
            defaultValue: {
              label: "先付款後取貨",
              value: "prepaid",
            },
          },
        },
      ],
      {
        type: "text",
        label: "聯絡地址",
        required: true,
        name: "address",
        props: {
          placeholder: "輸入聯絡地址",
        },
      },
      {
        type: "textarea",
        label: "備註",
        required: false,
        name: "description",
      },
    ],
    preLoad: [
      {
        name: "member_level_id",
        fetchUrl: "member-level",
        adaptor: selectAdaptor,
        createInitor: selectInitializer,
      },
      {
        name: "member_role_id",
        fetchUrl: "member-role",
        adaptor: selectAdaptor,
        createInitor: selectInitializer,
      },
      {
        name: "payment_id",
        fetchUrl: "member-payment",
        adaptor: selectAdaptor,
        createInitor: selectInitializer,
      },
      {
        name: "shipping_id",
        fetchUrl: "member-shipping",
        adaptor: selectAdaptor,
        createInitor: selectInitializer,
      },
    ],
    fetchUrl: "member-management",
    validationSchema: Yup.object().shape({
      name: Yup.string().required("此欄位必填"),
      account: Yup.string().required("此欄位必填"),
      status_id: Yup.string().required("此欄位必填"),
      password: Yup.string().when("_currentMode", {
        is: "create",
        then: () => Yup.string().min(4, "至少 4 個字").required("此欄位必填"),
        otherwise: () => Yup.string().min(4, "至少 4 個字"),
      }),
      email: Yup.string().email("電子郵件格式錯誤").nullable(),
      phone: Yup.string()
        .min(8, "電話格式錯誤")
        .max(10, "電話格式錯誤")
        .matches(/^[0-9]+$/, "電話格式錯誤")
        .required("此欄位必填"),
      uniform_number: Yup.string().min(8, "至少 8 個數字"),
      address: Yup.string().required("此欄位必填"),
    }),
    formField: {
      status_id: "applying",
      name: "",
      code: "新增後自動產生",
      account: "",
      password: "",
      email: "",
      member_level_id: null,
      member_role_id: null,
      phone: "",
      shipping_id: null,
      uniform_number: "",
      company_title: "",
      payment_id: null,
      payment: null,
      shipping_condition_id: "prepaid",
      address: "",
      description: "",
    },
    editAdaptor: (data) => ({
      ...data,
      email: data.email ?? "",
      company_title: data.company_title ?? "",
      uniform_number: data.uniform_number ?? "",
      address: data.address ?? "",
      description: data.description ?? "",
    }),
    submitAdaptor: (data) => ({
      ...data,
      email: data.email || null,
      company_title: data.company_title || null,
      uniform_number: data.uniform_number || null,
      address: data.address || null,
      description: data.description || null,
    }),
  },
  "member-level": {
    pageTitle: "會員等級",
    searchPlaceholder: "會員等級",
    createHeaderText: "會員等級",
    editHeaderText: "會員等級",
    column: memberLevelColumns,
    inputList: [
      {
        type: "text",
        label: "等級名稱",
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
    fetchUrl: "member-level",
    validationSchema: Yup.object().shape({
      name: Yup.string().required("此欄位必填"),
    }),
    formField: {
      name: "",
      description: "",
    },
  },
  "member-role": {
    pageTitle: "會員身分別",
    searchPlaceholder: "會員身分別",
    createHeaderText: "會員身分別",
    editHeaderText: "會員身分別",
    column: memberRoleColumns,
    inputList: [
      {
        type: "text",
        label: "角色名稱",
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
    fetchUrl: "member-role",
    validationSchema: Yup.object().shape({
      name: Yup.string().required("此欄位必填"),
    }),
    formField: {
      name: "",
      description: "",
    },
  },
  "member-payment": {
    pageTitle: "會員付款方式",
    searchPlaceholder: "付款方式",
    createHeaderText: "會員付款方式",
    editHeaderText: "會員付款方式",
    column: memberPaymentColumns,
    inputList: [
      {
        type: "text",
        label: "付款方式名稱",
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
    fetchUrl: "member-payment",
    validationSchema: Yup.object().shape({
      name: Yup.string().required("此欄位必填"),
    }),
    formField: {
      name: "",
      description: "",
    },
  },
  "member-shipping": {
    pageTitle: "會員出貨方式",
    searchPlaceholder: "出貨方式",
    createHeaderText: "會員出貨方式",
    editHeaderText: "會員出貨方式",
    column: memberShippingColumns,
    inputList: [
      {
        type: "text",
        label: "出貨方式名稱",
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
    fetchUrl: "member-shipping",
    validationSchema: Yup.object().shape({
      name: Yup.string().required("此欄位必填"),
    }),
    formField: {
      name: "",
      description: "",
    },
  },
  "inventory-management": {
    pageTitle: "盤點作業",
    searchPlaceholder: "盤點作業",
    createHeaderText: "盤點作業",
    editHeaderText: "盤點作業",
    column: inventoryManagementColumns,
    inputList: [
      [
        {
          type: "text",
          label: "盤點單號",
          required: true,
          name: "number",
        },
        {
          type: "select",
          label: "盤點倉別",
          required: true,
          name: "category",
        },
        {
          type: "select",
          label: "盤點儲位",
          required: true,
          name: "storage",
        },
      ],
      [
        {
          type: "date",
          label: "盤點日期",
          required: true,
          name: "date",
        },
        {
          type: "text",
          label: "商品",
          required: true,
          name: "product",
        },
        {
          type: "text",
          label: "商品類別",
          required: true,
          name: "product_category",
          props: {
            readonly: true,
          },
        },
      ],
      {
        type: "text",
        label: "盤點人員",
        required: true,
        name: "employee",
        col: 4,
      },
      {
        type: "text",
        label: "商品編號",
        required: true,
        name: "product_number",
        props: {
          readonly: true,
        },
      },
      {
        type: "text",
        label: "商品名稱",
        required: true,
        name: "product_name",
        props: {
          readonly: true,
        },
      },
      {
        type: "text",
        label: "商品規格",
        required: true,
        name: "product_format",
        props: {
          readonly: true,
        },
      },
      {
        type: "text",
        label: "儲位",
        required: true,
        name: "storage_backup",
        props: {
          readonly: true,
        },
      },
      {
        type: "text",
        label: "庫存數量",
        required: true,
        name: "stock_count",
        props: {
          readonly: true,
        },
      },
      {
        type: "text",
        label: "盤點數量",
        required: true,
        name: "inventory_count",
      },
      {
        type: "text",
        label: "差異數量",
        required: true,
        name: "difference_count",
      },
      {
        type: "textarea",
        label: "備註",
        name: "description",
      },
      {
        type: "checkbox",
        label: "確認",
        name: "confirm",
        col: 3,
      },
    ],
    // preLoad: [
    //   {
    //     name: "stock_category_id",
    //     fetchUrl: "stock-category",
    //     adaptor: selectAdaptor,
    //     createInitor: selectInitializer,
    //   },
    //   {
    //     name: "supplier_id",
    //     fetchUrl: "supplier",
    //     adaptor: selectAdaptor,
    //     createInitor: selectInitializer,
    //   },
    //   {
    //     name: "accounting_id",
    //     fetchUrl: "stock-accounting",
    //     adaptor: selectAdaptor,
    //     createInitor: selectInitializer,
    //   },
    //   {
    //     name: "level_price",
    //     fetchUrl: "member-level",
    //     adaptor: (data) =>
    //       data.map(({ name, id }) => ({
    //         name,
    //         id: `${id}`,
    //       })),
    //     createInitor: (data) =>
    //       data.map(({ id }) => ({ id: `${id}`, price: "" })),
    //   },
    //   {
    //     name: "role_price",
    //     fetchUrl: "member-role",
    //     adaptor: (data) =>
    //       data.map(({ name, id }) => ({
    //         name,
    //         id: `${id}`,
    //       })),
    //     createInitor: (data) =>
    //       data.map(({ id }) => ({ id: `${id}`, price: "" })),
    //   },
    //   {
    //     name: "stock_brand_id",
    //     fetchUrl: "stock-brand",
    //     adaptor: selectAdaptor,
    //     createInitor: selectInitializer,
    //   },
    // ],
    // fetchUrl: "",
    validationSchema: Yup.object().shape({
      // name: Yup.string().required("此欄位必填"),
    }),
    formField: {
      number: "",
      date: "",
      category: null,
      storage: null,
      product: "",
      productCategory: "",
      productNumber: "",
      productName: "",
      productFormat: "",
      storageBackUp: "",
      stockCount: "",
      inventoryCount: "",
      differenceCount: "",
      confirm: "",
    },
  },
  "inventory-transfer": {
    pageTitle: "調撥作業",
    searchPlaceholder: "調撥作業",
    createHeaderText: "調撥作業",
    editHeaderText: "調撥作業",
    column: inventoryTransferColumns,
    inputList: [
      [
        {
          type: "date",
          label: "出庫日期",
          required: true,
          name: "out_warehouse_date",
        },
        {
          type: "select",
          label: "出庫倉別",
          required: true,
          name: "out_warehouse_category",
        },
        {
          type: "select",
          label: "出庫儲位",
          required: true,
          name: "out_warehouse_storage",
        },
      ],
      [
        {
          type: "select",
          label: "入庫倉別",
          required: true,
          name: "warehouse_category",
        },
        {
          type: "select",
          label: "入庫儲位",
          required: true,
          name: "warehouse__storage",
        },
        {
          type: "text",
          label: "調撥商品編號",
          required: true,
          name: "transfer_number",
          props: {
            readonly: true,
          },
        },
      ],
      {
        type: "image",
        label: "商品封面照",
        required: true,
        name: "cover_image",
        props: {
          imagestyle: { minHeight: "150px", maxHeight: "200px" },
        },
      },
      [
        {
          type: "select",
          label: "商品名稱",
          required: true,
          name: "product_name",
          props: {
            readonly: true,
          },
        },
        {
          type: "number",
          label: "數量",
          required: true,
          name: "product_count",
          props: {
            readonly: true,
          },
        },
      ],
      {
        type: "switch",
        label: "調撥",
        required: true,
        name: "is_transfer",
        props: {
          readonly: true,
        },
      },
      {
        type: "select",
        label: "調撥人員",
        required: true,
        name: "transfer_employee",
      },
      {
        type: "textarea",
        label: "備註",
        name: "description",
      },
      {
        type: "switch",
        label: "儲存",
        required: true,
        name: "save",
      },
    ],
    // preLoad: [
    //   {
    //     name: "stock_category_id",
    //     fetchUrl: "stock-category",
    //     adaptor: selectAdaptor,
    //     createInitor: selectInitializer,
    //   },
    //   {
    //     name: "supplier_id",
    //     fetchUrl: "supplier",
    //     adaptor: selectAdaptor,
    //     createInitor: selectInitializer,
    //   },
    //   {
    //     name: "accounting_id",
    //     fetchUrl: "stock-accounting",
    //     adaptor: selectAdaptor,
    //     createInitor: selectInitializer,
    //   },
    //   {
    //     name: "level_price",
    //     fetchUrl: "member-level",
    //     adaptor: (data) =>
    //       data.map(({ name, id }) => ({
    //         name,
    //         id: `${id}`,
    //       })),
    //     createInitor: (data) =>
    //       data.map(({ id }) => ({ id: `${id}`, price: "" })),
    //   },
    //   {
    //     name: "role_price",
    //     fetchUrl: "member-role",
    //     adaptor: (data) =>
    //       data.map(({ name, id }) => ({
    //         name,
    //         id: `${id}`,
    //       })),
    //     createInitor: (data) =>
    //       data.map(({ id }) => ({ id: `${id}`, price: "" })),
    //   },
    //   {
    //     name: "stock_brand_id",
    //     fetchUrl: "stock-brand",
    //     adaptor: selectAdaptor,
    //     createInitor: selectInitializer,
    //   },
    // ],
    // fetchUrl: "",
    validationSchema: Yup.object().shape({
      // name: Yup.string().required("此欄位必填"),
    }),
    formField: {
      out_warehouse_date: "",
      out_warehouse_category: null,
      out_warehouse_storage: null,
      warehouse_category: null,
      warehouse_storage: null,
      transfer_number: "",
      cover_image: "",
      product_name: null,
      product_count: "",
      is_transfer: false,
      transfer_employee: "",
      description: "",
      save: false,
    },
  },
  "sale-management": {
    pageTitle: "訂單作業",
    searchPlaceholder: "訂單作業",
    createHeaderText: "訂單作業",
    editHeaderText: "訂單作業",
    column: saleColumns,
    hideSubmitField: true,
    hidePromptField: true,
    inputList: (() => {
      const labelclassname = "min-w-80px mt-2";
      const inputclassname = "";
      const colClassName = "d-flex align-items-center justify-content-between";
      return [
        [
          {
            type: "plain",
            label: "訂單編號 :",
            name: "code",
            className: colClassName,
            props: {
              labelclassname,
              inputclassname,
            },
          },
          {
            type: "plain",
            label: "訂單日期 :",
            name: "sale_date",
            className: colClassName,
            props: {
              labelclassname,
              inputclassname,
            },
          },
        ],
        [
          {
            type: "plain",
            label: "訂單狀態 :",
            name: "status",
            className: colClassName,
            props: {
              labelclassname,
              inputclassname,
            },
          },
          {
            type: "plain",
            label: "付款方式 :",
            name: "payment",
            className: colClassName,
            props: {
              labelclassname,
              inputclassname,
            },
          },
        ],
        [
          {
            type: "plain",
            label: "櫃單 :",
            className: colClassName,
            props: {
              labelclassname,
              inputclassname,
            },
          },
          {
            type: "select",
            label: "出貨方式 :",
            name: "delivery",
            className: colClassName,
            props: {
              options: [
                {
                  label: "板出",
                  value: "board",
                },
                {
                  label: "宅配",
                  value: "home",
                },
              ],
              labelclassname,
              inputclassname: `w-100`,
            },
          },
        ],
        [
          {
            type: "sale-member",
            label: "會員名稱 :",
            name: "member_id",
            className: colClassName,
            props: {
              labelclassname,
              inputclassname: `w-100`,
            },
          },
          {
            type: "plain",
            label: "會員編號 :",
            name: "member_code",
            className: colClassName,
            props: {
              labelclassname,
              inputclassname,
            },
          },
        ],
        {
          node: <div className="border-bottom border-2 border-secondary my-2"></div>,
          className: "mb-0",
        },
        {
          name: "stock",
          type: "sale-stock-list",
          useFormikKey: "member_id",
          props: {
            storeTarget: "person_list",
          },
        },
        {
          name: "person_list",
          type: "sale-person-list",
        },
        Object.defineProperty(
          [
            {
              type: "sale-separate",
              className: "p-0 me-4",
              col: "auto",
              props: {
                target: "person_list",
              },
            },
            {
              type: "submit-field",
              className: "g-0",
              props: {
                submitText: "儲存",
              },
              col: "auto",
            },
          ],
          "className",
          {
            value: "flex-center mt-12",
          }
        ),
      ];
    })(),
    fetchUrl: "sale-management",
    preLoad: [
      {
        name: "member_id",
        fetchUrl: "member-management?enable=",
        adaptor: (data) =>
          data.map((item) => ({ ...item, label: item.name, value: item.id })),
        createInitor: selectInitializer,
      },
      {
        name: "member_code",
        fetchUrl: "member-management?enable=",
        createInitor: (data) => data[0]?.code || "沒有資料",
      },
      {
        name: "payment",
        fetchUrl: "member-management?enable=",
        createInitor: (data) => data[0]?.payment || "沒有資料",
      },
    ],
    validationSchema: Yup.object().shape({
      // Yup.string().when("_currentMode", {
      //   is: "create",
      //   then: () => Yup.string().min(4, "至少 4 個字").required("此欄位必填"),
      //   otherwise: () => Yup.string().min(4, "至少 4 個字"),
      // }),
      /**
       * person_list: Yup.mixed().when("_separate", {
       *   is: true,
       *   then: () => Yup.mixed().test({
       *     test: (data) => {},
       *     message: "請提供價錢",
       *   }),
       })
       * }),
       * 
       */
      // person_list: Yup.mixed().test({
      //   test: (data) => !data.some(({ price }) => !/^[1-9][0-9]*$/.test(price)),
      //   message: "請提供價錢",
      // }),
    }),
    formField: {
      code: "系統自動產生",
      status: "處理中",
      delivery: "board",
      member_id: null,
      member_code: null,
      person_list: [
        {
          id: "_",
          main_reciever: true,
        },
      ],
      get sale_date() {
        return getCurrentTime();
      },
    },
  },
  "sale-type": {
    pageTitle: "訂單類別維護",
    searchPlaceholder: "訂單類別",
    createHeaderText: "訂單類別",
    editHeaderText: "訂單類別",
    column: orderCategoryColumns,
    inputList: [
      {
        type: "text",
        label: "標籤名稱",
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
    fetchUrl: "sale-type",
    validationSchema: Yup.object().shape({
      name: Yup.string().required("此欄位必填"),
    }),
    formField: {
      name: "",
      description: "",
    },
  },
};

const ArrangeWithProperty = Object.entries(dictionary).reduce(
  (tableDict, [table, content]) => {
    Object.entries(content).reduce((dict, [key, value]) => {
      dict[key] ??= {};
      dict[key][table] = value;
      return dict;
    }, tableDict);
    return tableDict;
  },
  {}
);

export default ArrangeWithProperty;
