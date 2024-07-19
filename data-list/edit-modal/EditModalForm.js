import React from "react";
import { useState, useEffect, Fragment } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Select from "react-select";
import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";

import { Row, Col, FormCheck } from "react-bootstrap";
import { useFormik } from "formik";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { useTableData } from "../core/tableDataProvider";

import { useSession } from "next-auth/react";

const testMode = false;

const CustomEditor = dynamic(
  () => {
    return import("@/components/custom-editor");
  },
  { ssr: false }
);

import currentTable from "../globalVariable/currentTable";
import dict from "../dictionary/tableDictionary";
import { useModals } from "@/tool/hooks";
import {
  onlyInputNumbers,
  toArray,
  transImageUrl,
  checkArray,
} from "@/tool/helper";

import {
  createDataRequest,
  updateDataRequest,
  regularReadData,
} from "../core/request";

const {
  inputList,
  formField,
  validationSchema,
  preLoad,
  editAdaptor,
  submitAdaptor,
  hideSubmitField,
  hidePromptField,
} = dict;

const hoistFormik = {
  formik: null,
  set(target) {
    this.formik = target;
  },
  get() {
    return this.formik;
  },
  clear() {
    this.formik = null;
  },
};

const hoistPreLoadData = {
  data: null,
  set(target) {
    return (this.data = target);
  },
  get() {
    return this.data;
  },
  clear() {
    this.data = null;
  },
};

const InputLabel = ({ required, text, className, holder, ...props }) =>
  holder ? (
    <div className="fs-6 mb-2 holder">text</div>
  ) : (
    <label
      {...props}
      className={clsx(className, "fw-bold fs-6 mb-2", {
        required,
      })}
    >
      {text}
    </label>
  );

const ValidateInputField = ({
  required = false,
  label,
  name,
  formik = hoistFormik.get(),
  placeholder,
  inputclassname = "",
  labelclassname = "",
  type = "text",
  readonly = false,
  onlynumber = false,
  isMulti = false, // only apply for select
  isDisabled,
  holder,
  defaultValue,
  onClick,
  onChange,
  onBlur,
  options, // only apply for select
}) =>
  holder ? (
    <>
      <InputLabel holder />
      <div className="form-control form-control-solid mb-3 mb-lg-0 bg-transparent holder shadow-none">
        text
      </div>
    </>
  ) : (
    <>
      {label && (
        <InputLabel
          required={required}
          text={label}
          htmlFor={`input_${name}`}
          className={clsx(
            labelclassname,
            !readonly && type !== "plain" && "cursor-pointer"
          )}
        />
      )}
      {{
        plain: (
          <p
            className={clsx(
              inputclassname,
              "form-control mb-3 mb-lg-0 border-secondary"
            )}
            {...(typeof onClick === "function" && { onClick })}
          >
            {hoistFormik.get().values?.[name] ?? "沒有資料"}
          </p>
        ),
        select: (
          <>
            {options ||
            (formik.values?.[name] &&
              hoistPreLoadData.get()?.[name]?.length > 0) ? (
              <Select
                {...{ name, isMulti, isDisabled }}
                inputId={`input_${name}`}
                className={clsx(
                  "react-select-styled react-select-solid border border-gray-100 rounded",
                  inputclassname
                )}
                classNamePrefix="react-select"
                placeholder={placeholder ?? "請選擇或輸入關鍵字"}
                options={options ?? hoistPreLoadData.get()[name]}
                defaultValue={
                  options
                    ? options.filter(
                        (option) => option.value === formik.values[name]
                      ) || defaultValue
                    : isMulti
                    ? hoistPreLoadData
                        .get()
                        [name].filter((option) =>
                          formik.values[name].includes(option.value)
                        )
                    : hoistPreLoadData
                        .get()
                        [name].find(
                          (option) => option.value === formik.values[name]
                        )
                }
                onChange={
                  onChange ??
                  ((items) => {
                    formik.setFieldValue(
                      name,
                      Array.isArray(items)
                        ? items.map((item) => item.value)
                        : items.value
                    );
                  })
                }
              />
            ) : (
              <div
                onClick={() => formik.setFieldTouched(name, true)}
                className="form-select form-select-solid text-gray-500"
              >
                目前沒有資料
              </div>
            )}
          </>
        ),
        textarea: (
          <textarea
            {...formik.getFieldProps(name)}
            id={`input_${name}`}
            className="border border-1 border-gray-200 form-control form-control-solid"
            style={{ minHeight: "120px" }}
          ></textarea>
        ),
      }[type] ??
        (["text", "password"].includes(type) && (
          <input
            {...(!readonly && name !== "_stop" && formik.getFieldProps(name))}
            id={`input_${name}`}
            placeholder={placeholder}
            className={clsx(
              "form-control form-control-solid mb-3 mb-lg-0",
              { "is-invalid": formik?.touched[name] && formik?.errors[name] },
              { "is-valid": formik?.touched[name] && !formik?.errors[name] },
              inputclassname
            )}
            defaultValue={defaultValue}
            type={type}
            autoComplete="off"
            {...(onlynumber && {
              onKeyDown: onlyInputNumbers,
            })}
            {...(typeof onChange === "function" && { onChange })}
            {...(typeof onBlur === "function" && { onBlur })}
            disabled={readonly || formik?.isSubmitting}
          />
        ))}
      {formik?.touched[name] && formik?.errors[name] && (
        <div className="fv-plugins-message-container">
          <div className="fv-help-block">
            <span role="alert">{formik?.errors[name]}</span>
          </div>
        </div>
      )}
    </>
  );

const LabelHolder = () => InputLabel({ holder: true });
const TextHolder = () => ValidateInputField({ holder: true });

const CheckBoxInput = (props) =>
  ValidateInputField({ ...props, type: "checkbox" });

const NumberInput = (props) =>
  ValidateInputField({ ...props, onlynumber: true });

const MultiSelectInput = (props) =>
  ValidateInputField({ ...props, type: "select", isMulti: true });

const SwitchInput = (props) => (
  <Row
    className={`cursor-pointer ${props.inline && "flex-column g-3"}`}
    as="label"
  >
    <Col>
      <span className="fw-bold fs-6">{props.label}</span>
    </Col>
    <Col sm={"auto"} className={`${!props.inline && "text-center"}`}>
      <FormCheck
        {...hoistFormik.get().getFieldProps(props.name)}
        inline
        type="switch"
        defaultChecked={hoistFormik.get().getFieldProps(props.name).value}
        id={`switch_${props.name}`}
        name={props.name}
      />
    </Col>
  </Row>
);

const ImageInput = (props) => {
  return (
    <div className="d-flex flex-column h-100">
      <InputLabel
        htmlFor={`image_${props.name}`}
        className="cursor-pointer align-self-start"
        required={props.required}
        text={props.label}
      />
      <div className="flex-center flex-grow-1">
        <label
          className="position-relative h-100 w-100 bg-gray-200 rounded-3 cursor-pointer overflow-hidden flex-center text-gray-500"
          style={props.imagestyle || { minHeight: "100px" }}
          onClick={() => hoistFormik.get().setFieldTouched(props.name, true)}
          htmlFor={`image_${props.name}`}
        >
          請選擇照片
          {(hoistFormik.get()?.values[`${props.name}_preview`] ||
            transImageUrl(hoistFormik.get()?.values[props.name])) && (
            <Image
              sizes="100px"
              fill
              className="top-0 start-0 object-fit-cover"
              src={
                hoistFormik.get().values[`${props.name}_preview`] ||
                transImageUrl(hoistFormik.get().values[props.name])
              }
              alt={`image_${props.name}`}
            />
          )}
          <input
            hidden
            accept="image/*"
            id={`image_${props.name}`}
            type="file"
            onChange={(event) => {
              const [file] = event.target.files;
              if (!file) return;
              const src = URL.createObjectURL(file);
              hoistFormik.get().setFieldValue(`${props.name}_preview`, src);
              hoistFormik.get().setFieldValue(props.name, file);
            }}
          />
        </label>
      </div>
      {hoistFormik.get()?.touched[props.name] &&
        hoistFormik.get()?.errors[props.name] && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{hoistFormik.get()?.errors[props.name]}</span>
            </div>
          </div>
        )}
    </div>
  );
};

const MultiImageInput = (props) => {
  return (
    <div className="">
      <InputLabel
        className="d-inline-block cursor-pointer"
        htmlFor={`image_${props.name}`}
        required={props.required}
        text={props.label}
      />
      <label
        className="d-block overflow-x-scroll text-nowrap bg-gray-200 p-3 pb-0 rounded-2"
        htmlFor={`image_${props.name}`}
      >
        {checkArray(hoistFormik.get()?.values?.[`${props.name}_preview`]) ? (
          hoistFormik
            .get()
            .values[`${props.name}_preview`].map(({ id, src }) => (
              <div key={id} className="position-relative d-inline-block m-5">
                <div
                  className="position-relative rounded-3 overflow-hidden shadow-sm"
                  style={{ width: "100px", height: "100px" }}
                >
                  <Image
                    sizes="100px"
                    fill
                    className="top-0 start-0 object-fit-cover"
                    src={src}
                    alt={`image_${props.name}`}
                  />
                </div>
                <span
                  className="position-absolute border flex-center top-0 start-100 translate-middle rounded-circle bg-white shadow bi-x cursor-pointer"
                  style={{
                    height: "20px",
                    width: "20px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    const newValues = hoistFormik
                      .get()
                      .values[`${props.name}_preview`].filter(
                        (image) => image.id !== id
                      );

                    const { fileList, persistUrl } = newValues.reduce(
                      (dict, image) => ({
                        ...dict,
                        ...(image.file
                          ? { fileList: [...dict.fileList, image.file] }
                          : { persistUrl: [...dict.persistUrl, image.id] }),
                      }),
                      { fileList: [], persistUrl: [] }
                    );

                    [
                      {
                        fieldName: `${props.name}_preview`,
                        fieldValue: newValues,
                      },
                      {
                        fieldName: props.name,
                        fieldValue: fileList,
                      },
                      {
                        fieldName: `${props.name}_persist`,
                        fieldValue: persistUrl,
                      },
                    ].forEach(({ fieldName, fieldValue }) => {
                      hoistFormik.get().setFieldValue(fieldName, fieldValue);
                    });
                  }}
                ></span>
              </div>
            ))
        ) : (
          <div
            className="text-center text-gray-500 my-5 cursor-pointer"
            style={{ height: "100px", alignContent: "center" }}
          >
            請選擇照片
          </div>
        )}
        <input
          hidden
          accept="image/*"
          multiple
          id={`image_${props.name}`}
          type="file"
          onInput={(event) => {
            const files = [...event.target.files];
            if (files.length === 0) return;
            const images = files.map((file) => {
              const url = URL.createObjectURL(file);
              return { id: url, src: url, file };
            });
            const newValues = [
              ...(hoistFormik.get().values[`${props.name}_preview`] || []),
              ...images,
            ];
            hoistFormik.get().setFieldValue(`${props.name}_preview`, newValues);
            hoistFormik.get().setFieldValue(
              props.name,
              newValues.reduce(
                (dict, image) => (image.file ? [...dict, image.file] : dict),
                []
              )
            );
          }}
        />
      </label>
    </div>
  );
};

const PriceTable = (props) => {
  return (
    <div>
      <InputLabel required={props.required} text={props.label} />
      {hoistPreLoadData.get()?.[props.name]?.length > 0 ? (
        <Row className="g-0">
          {hoistPreLoadData
            .get()
            ?.[props.name].map(({ id, name, price }, index) => (
              <Col
                sm={3}
                key={id}
                className={`border border-gray-300 ${
                  index % 4 !== 0 && "border-start-0"
                }`}
              >
                <div
                  className="bg-gray-500 text-white text-center p-2"
                  style={{ letterSpacing: "1px" }}
                >
                  {name}
                </div>
                <div className="p-5">
                  <NumberInput
                    name={`${props.name}_${id}`}
                    defaultValue={
                      hoistFormik
                        .get()
                        .values[props.name]?.find(({ id: tid }) => tid === id)
                        ?.price || price
                    }
                    inputclassname={{
                      "is-invalid":
                        (hoistFormik.get().touched[`${props.name}_${id}`] ||
                          hoistFormik.get().touched[props.name]?.[index]?.id) &&
                        !/^[1-9][0-9]*$/.test(
                          hoistFormik
                            .get()
                            .values[props.name]?.find(
                              ({ id: tid }) => tid === id
                            )?.price
                        ),
                      "is-valid":
                        (hoistFormik.get().touched[`${props.name}_${id}`] ||
                          hoistFormik.get().touched[props.name]?.[index]?.id) &&
                        /^[1-9][0-9]*$/.test(
                          hoistFormik
                            .get()
                            .values[props.name].find(
                              ({ id: tid }) => tid === id
                            )?.price
                        ),
                    }}
                    onChange={(e) => {
                      hoistFormik.get().setFieldValue(
                        props.name,
                        hoistFormik
                          .get()
                          .values[props.name].filter(
                            ({ id: tid }) => tid !== id
                          )
                          .concat({
                            id,
                            price: e.target.value,
                          })
                      );
                    }}
                  />
                </div>
              </Col>
            ))}
        </Row>
      ) : (
        <div className="bg-gray-200 p-8 text-center text-gray-500 rounded-2">
          目前沒有資料
        </div>
      )}
      {hoistFormik.get().touched[props.name] &&
        (Object.values(hoistFormik.get().status?.[props.name] ?? {}).some(
          (price) => isNaN(parseInt(price))
        ) ||
          hoistFormik.get().errors[props.name]) && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{hoistFormik.get().errors[props.name]}</span>
            </div>
          </div>
        )}
    </div>
  );
};

let imageKeeper = [];
const EditorField = (props) => {
  const addImage = ({ file, src }) => {
    imageKeeper.push({ id: src, file, ori: file.name });
    hoistFormik.get().setFieldValue(`${props.name}_preview`, imageKeeper);
    hoistFormik.get().setFieldValue(
      `${props.name}_image`,
      imageKeeper.map(({ file }) => file)
    );
  };

  const onChange = (event, editor) => {
    const data = editor.getData();
    hoistFormik.get().setFieldValue(props.name, data);

    const removeImages = event.source.differ._cachedChangesWithGraveyard.reduce(
      (dict, item) =>
        item.type === "remove" && item.name === "imageBlock"
          ? dict.concat(item.attributes.get("src"))
          : dict,
      []
    );
    // console.log("removeImages", removeImages);

    if (removeImages.length === 0) return;

    const newValue = imageKeeper.filter(({ id }) => !removeImages.includes(id));
    hoistFormik.get().setFieldValue(
      `${props.name}_image_persist`,
      hoistFormik
        .get()
        .values[`${props.name}_image_persist`].filter(
          (path) => removeImages.findIndex((url) => url.includes(path)) === -1
        )
    );

    imageKeeper = newValue;

    hoistFormik.get().setFieldValue(`${props.name}_preview`, newValue);

    hoistFormik.get().setFieldValue(
      `${props.name}_image`,
      newValue.map(({ file }) => file)
    );
  };

  return (
    <div>
      <InputLabel text={props.label} required={props.required} />
      <CustomEditor
        {...{
          addImage,
          onChange,
          initialData: hoistFormik.get().values[props.name],
        }}
      />
    </div>
  );
};

const getInput = (type) => (props) => ValidateInputField({ ...props, type });
const generateInputs = (arr) =>
  arr.reduce(
    (dict, type) => ({
      ...dict,
      [type]: getInput(type),
    }),
    {}
  );

const Button = ({
  type = "button",
  onClick,
  text,
  className,
  variant = "primary",
}) => (
  <button
    {...{ type, onClick }}
    className={clsx("btn", className, `btn-${variant}`)}
  >
    {text}
  </button>
);

const SubmitField = ({
  onCancel,
  submitText,
  cancelText,
  reverse,
  className,
}) => (
  <div
    className={clsx(
      className ?? ["flex-center", reverse && "flex-row-reverse"]
    )}
  >
    <button
      type="reset"
      {...(typeof onCancel === "function" && { onClick: onCancel })}
      className={clsx("btn btn-secondary", `m${reverse ? "s" : "e"}-2`)}
      data-kt-users-modal-action="cancel"
      disabled={hoistFormik.get().isSubmitting}
    >
      {cancelText || "取消"}
    </button>

    <button
      type="submit"
      className={clsx("btn btn-primary", `m${reverse ? "e" : "s"}-2`)}
      data-kt-users-modal-action="submit"
      disabled={hoistFormik.get().isSubmitting}
    >
      <span className="indicator-label">{submitText || "確認"}</span>
      {hoistFormik.get().isSubmitting && (
        <span className="indicator-progress">
          Please wait...{" "}
          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
        </span>
      )}
    </button>
  </div>
);

const SaleMember = (props) =>
  getInput("select")({
    ...props,
    onChange: (item) => {
      hoistFormik.get().setFieldValue(props.name, item.value);
      const memberData = hoistPreLoadData
        .get()
        [props.name].find((member) => `${member.id}` === item.value);

      const data = {
        ...hoistFormik.get().values,
        [props.name]: item.value,
        member_code: memberData.code,
        payment: memberData.payment,
      };

      hoistFormik.get().setValues(data);
    },
  });

const SaleStockList = (props) => {
  const stockData = hoistPreLoadData.get()?.[props.name];

  return (
    <div>
      <div className="d-flex overflow-x-auto bg-gray-200 p-8 rounded-2">
        {checkArray(stockData) ? (
          stockData.map((stock) => (
            <div
              key={stock.id}
              className="d-flex bg-gray-100 p-2 pe-4 me-6 cursor-pointer shadow-sm rounded-4"
              onClick={() => {
                if (!props.storeTarget) return;
                const prev = hoistFormik.get().values[props.storeTarget];

                hoistFormik.get().setFieldValue(
                  props.storeTarget,
                  prev.map((item) => {
                    if (!checkArray(item.stockList))
                      return { ...item, stockList: [stock] };
                    return {
                      ...item,
                      ...(item.stockList.findIndex(
                        (stockItem) => stockItem.id === stock.id
                      ) === -1 && { stockList: [...item.stockList, stock] }),
                    };
                  })
                );
              }}
            >
              <div
                className="position-relative rounded-3 me-3 overflow-hidden"
                style={{ height: "85px", width: "85px" }}
              >
                <Image
                  sizes="85px"
                  fill
                  className="position-relative object-fit-cover"
                  src={stock.cover_image}
                  alt={`${stock.name} stock image`}
                />
              </div>
              <div className="fs-5 align-content-center text-nowrap">
                <div>
                  <span>商品編號 : </span>
                  <span>{stock.code}</span>
                </div>
                <div>
                  <span>商品名稱 : </span>
                  <span>{stock.name}</span>
                </div>
                <div>
                  <span>商品單價 : </span>
                  <span>{stock.price}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="text-center text-gray-500 my-5"
            style={{ alignContent: "center" }}
          >
            目前沒有商品資料
          </div>
        )}
      </div>
    </div>
  );
};

const SalePersonList = (props) => {
  const colDict = [
    { colName: "項次", key: "id", col: 1 },
    { colName: "收件人", key: "name", col: 2, inputType: "text" },
    { colName: "收件人電話", key: "phone", col: 3, inputType: "text" },
    { colName: "收件人地址", key: "address", col: 4, inputType: "text" },
    { colName: "小記", key: "price", col: 2 },
  ];

  const stockColDict = [
    { colName: "移除", key: "", col: 1, inputType: "remove" },
    { colName: "商品圖片", key: "cover_image", col: 2, inputType: "image" },
    { colName: "商品編號", key: "code", col: 2 },
    { colName: "商品名稱", key: "name", col: 2 },
    { colName: "規格", key: "specification", col: 1 },
    { colName: "單價", key: "price", col: 1 },
    { colName: "變價", col: 1, inputType: "text" },
    { colName: "數量", col: 1 },
    { colName: "小記", col: 1 },
  ];

  return (
    <>
      <Row className="g-0">
        {colDict.map(({ col, colName, key }) => (
          <Col sm={col} key={key} className="border border-gray-300">
            <div className="bg-gray-500 text-white text-center p-2">
              {colName}
            </div>
          </Col>
        ))}
      </Row>
      {checkArray(hoistFormik.get().values[props.name]) &&
        hoistFormik.get().values[props.name].map((item, index) => (
          <Fragment key={item.id ?? index}>
            <Row className="g-0">
              {colDict.map(({ key, col, inputType }, index) => (
                <Col
                  sm={col}
                  key={key}
                  className={`p-2 border flex-center ${
                    index !== 0 && "border-start-0"
                  }`}
                >
                  {inputType ? (
                    getInput(inputType)({
                      name: "_stop",
                      defaultValue: item[key],
                      onChange: ({ target: { value } }) => {
                        const prevList = hoistFormik.get().values[props.name];
                        hoistFormik.get().setFieldValue(
                          props.name,
                          prevList.map((prevItem) =>
                            prevItem.id === item.id
                              ? { ...prevItem, [key]: value }
                              : prevItem
                          )
                        );
                      },
                    })
                  ) : (
                    <div className="">{item[key]}</div>
                  )}
                </Col>
              ))}
            </Row>
            <Row className="g-0">
              {stockColDict.map(({ colName, col }, index) => (
                <Col sm={col} key={index} className="border border-gray-300">
                  <div className="bg-primary text-white text-center p-2">
                    {colName}
                  </div>
                </Col>
              ))}
            </Row>
            {checkArray(item.stockList) &&
              item.stockList.map((stock) => (
                <Row className="g-0" key={stock.id}>
                  {stockColDict.map(({ key, col, inputType }, index) => (
                    <Col
                      sm={col}
                      key={key}
                      className={`border flex-center ${
                        index !== 0 && "border-start-0"
                      }`}
                    >
                      {{
                        image: (
                          <div className="rounded-3 overflow-hidden">
                            <Image
                              width={75}
                              height={75}
                              src={stock[key]}
                              alt={"stock cover image"}
                            />
                          </div>
                        ),
                        text: (
                          <div className="py-2 px-1">
                            {getInput(inputType)({
                              name: `_stop`,
                              defaultValue: stock["price"],
                            })}
                          </div>
                        ),
                        remove: (
                          <div
                            className="w-25px h-25px rounded-circle flex-center cursor-pointer bg-danger fs-1 bi bi-x text-white"
                            onClick={() => {
                              const prevList =
                                hoistFormik.get().values[props.name];
                              hoistFormik.get().setFieldValue(
                                props.name,
                                prevList.map((personRow) =>
                                  personRow.id !== item.id
                                    ? personRow
                                    : {
                                        ...personRow,
                                        stockList: personRow.stockList.filter(
                                          (s) => s.id !== stock.id
                                        ),
                                      }
                                )
                              );
                            }}
                          ></div>
                        ),
                      }[inputType] ?? <div className="p-2">{stock[key]}</div>}
                    </Col>
                  ))}
                </Row>
              ))}
          </Fragment>
        ))}
    </>
  );
};

const inputDictionary = {
  "label-holder": LabelHolder,
  "text-holder": TextHolder,
  ...generateInputs([
    "text",
    "textarea",
    "password",
    "date",
    "select",
    "plain",
  ]),
  "multi-select": MultiSelectInput,
  number: NumberInput,
  switch: SwitchInput,
  image: ImageInput,
  "multi-image": MultiImageInput,
  "price-table": PriceTable,
  editor: EditorField,
  checkbox: CheckBoxInput,
  "sale-person-list": SalePersonList,
  "sale-member": SaleMember,
  "sale-stock-list": SaleStockList,
  button: Button,
  /** "submit-field" will be automatically append when editForm rendered */
};

const createRowColTree = (arr) =>
  arr.map((group, groupIndex) => {
    return (
      <Row className={group.className ?? "mb-5 g-6"} key={groupIndex}>
        {toArray(group).map((input, inputIndex) => {
          if (Array.isArray(input))
            return (
              <Col sm={input.col} key={inputIndex} className={input.className}>
                {createRowColTree(input)}
              </Col>
            );
          const Input = inputDictionary[input.type];
          if (!Input && !input.node) return false;

          return (
            <Col sm={input.col} key={inputIndex} className={input.className}>
              {input.node ?? (
                <Input
                  name={input.name}
                  label={input.label}
                  required={input.required}
                  {...input.props}
                />
              )}
            </Col>
          );
        })}
      </Row>
    );
  });

const EditModalForm = () => {
  const { data, status } = useSession();
  const token = data?.user?.accessToken;

  const router = useRouter();
  const { setItemIdForUpdate, itemIdForUpdate } = useListView();

  const currentMode = (() => {
    if (itemIdForUpdate) return "edit";
    if (itemIdForUpdate === null) return "create";
    return "close";
  })();

  const createMode = currentMode === "create";
  const editMode = currentMode === "edit";

  const tableName = currentTable.get();
  const fields =
    inputList?.[tableName] || (!console.warn("No input list provided.") && []);
  const preLoadList = preLoad?.[tableName] || [];
  const showSubmitField = !hideSubmitField?.[tableName];
  const showPromptField = !hidePromptField?.[tableName];

  const { tableData, preLoadData, setPreLoadData } = useTableData();

  const [initialValues, setInitialValues] = useState(
    (() => {
      if (createMode)
        return (
          formField?.[tableName] ||
          console.warn("No form field provided.") ||
          {}
        );

      const currentData = tableData.find((data) => data.id === itemIdForUpdate);

      return typeof editAdaptor[tableName] === "function"
        ? editAdaptor[tableName](currentData)
        : Object.keys(formField[tableName]).reduce((result, key) => {
            result[key] =
              typeof editAdaptor[tableName]?.[key] === "function"
                ? editAdaptor[tableName][key](currentData[key])
                : currentData[key];
            return result;
          }, {});
    })()
  );

  //提醒系列
  const [popupSet, setPopupSet] = useState({ message: "", icon: "" });
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema[tableName],
    onSubmit: async (values) => {
      const submitData =
        typeof submitAdaptor[tableName] === "function"
          ? submitAdaptor[tableName](values, currentMode)
          : values;

      await {
        async create() {
          if (testMode) return console.log("Create Test: ", submitData);
          await createDataRequest(token, submitData);
          setPopupSet({
            message: "新增成功",
            icon: "/icon/check-circle.svg",
          });
          handleShowModal("popup");
        },
        async edit() {
          if (testMode) return console.log("Edit Test: ", submitData);
          await updateDataRequest(token, {
            ...submitData,
            id: itemIdForUpdate,
          });
          setPopupSet({
            message: "編輯成功",
            icon: "/icon/check-circle.svg",
          });
          handleShowModal("popup");
        },
        close() {},
      }[currentMode]();
    },
  });
  hoistFormik.set(formik);
  formik.values?.["_currentMode"] &&
    (formik.values["_currentMode"] = currentMode);
  // console.log("===== formik ======", formik.values);

  const closeModal = () => setItemIdForUpdate(undefined);
  inputDictionary["submit-field"] ??= (props) => (
    <SubmitField onCancel={closeModal} {...props} />
  );

  /**
   * handle preLoad data
   * Note that actual use data is hoistPreLoadData not preLoadData
   * preLoadData is use for cache
   */
  useEffect(() => {
    (async () => {
      if (preLoadList.length === 0) return;
      await Promise.all(
        preLoadList.map(async ({ name, fetchUrl, adaptor, createInitor }) => {
          if (!name || !fetchUrl)
            return console.warn(
              "No fetchUrl or name provided for perLoadData."
            );

          const rawData = await (async () => {
            if (preLoadData[name]) return preLoadData[name];
            if (preLoadData[fetchUrl]) {
              setPreLoadData((pre) => ({
                ...pre,
                [name]: res.data,
              }));
              return preLoadData[fetchUrl];
            }

            const res = await regularReadData(token, fetchUrl);
            if (!res || !res.data) return false;
            setPreLoadData((pre) => ({
              ...pre,
              [name]: res.data,
              [fetchUrl]: res.data,
            }));
            return res.data;
          })();
          if (!rawData) return;

          if (createMode) {
            setInitialValues((prev) => ({
              ...prev,
              [name]:
                typeof createInitor === "function"
                  ? createInitor(rawData)
                  : rawData,
            }));
          }

          hoistPreLoadData.set({
            ...hoistPreLoadData.get(),
            [name]: typeof adaptor === "function" ? adaptor(rawData) : rawData,
          });
        })
      );
    })();

    return () => (imageKeeper = []);
  }, []);

  return (
    <>
      <form
        id="kt_modal_add_user_form"
        className="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {showPromptField && (
          <div className="mb-7 d-flex">
            <div className="bg-secondary px-5 py-2 border rounded-1">
              <span className="">注意 :</span>
              <span className="text-danger  px-3">*</span>
              <span className="">為必填欄位</span>
            </div>
          </div>
        )}
        <div
          className="d-flex flex-column scroll-y-auto pt-3"
          id="kt_modal_add_user_scroll"
          data-kt-scroll="true"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-max-height="auto"
          data-kt-scroll-dependencies="#kt_modal_add_user_header"
          data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
          data-kt-scroll-offset="300px"
        >
          {createRowColTree(fields)}
        </div>

        {showSubmitField && (
          <div className="mt-12">
            <SubmitField onCancel={closeModal} />
          </div>
        )}
      </form>

      {/* popup modal */}
      <ModalWrapper
        key="popup"
        show={isModalOpen("popup")}
        size="lg"
        onHide={() => {
          router.push(router.asPath.split("?")[0]);
          closeModal();
        }}
      >
        <PopUp
          imageSrc={popupSet.icon}
          title={popupSet.message}
          confirmOnClick={() => {
            router.push(router.asPath.split("?")[0]);
            closeModal();
          }}
        />
      </ModalWrapper>
    </>
  );
};

export { EditModalForm };
