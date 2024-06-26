import React from "react";
import { useState, useEffect, useRef } from "react";

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

const CustomEditor = dynamic(
  () => {
    return import("@/components/custom-editor");
  },
  { ssr: false }
);

import currentTable from "../globalVariable/currentTable";
import dict from "../dictionary/tableDictionary";
import { useModals } from "@/tool/hooks";
import { onlyInputNumbers, toArray, transImageUrl } from "@/tool/helper";

import {
  createDataRequest,
  updateDataRequest,
  getAllData,
} from "../core/request";

const { inputList, formField, validationSchema, preLoad } = dict;

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
      className={clsx(
        "fw-bold fs-6 mb-2",
        {
          required,
        },
        className
      )}
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
  holder,
  defaultValue,
  onChange,
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
          className={clsx(labelclassname, "cursor-pointer")}
        />
      )}
      {
        {
          text: (
            <input
              {...formik.getFieldProps(name)}
              id={`input_${name}`}
              placeholder={placeholder}
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                inputclassname,
                { "is-invalid": formik?.touched[name] && formik?.errors[name] },
                { "is-valid": formik?.touched[name] && !formik?.errors[name] }
              )}
              defaultValue={defaultValue}
              type={type}
              name={name}
              autoComplete="off"
              {...(onlynumber && {
                onKeyDown: onlyInputNumbers,
              })}
              {...(onChange && typeof onChange === "function" && { onChange })}
              disabled={readonly || formik?.isSubmitting}
            />
          ),
          select: (
            <>
              {formik.values[name] &&
              hoistPreLoadData.get()?.[name]?.length > 0 ? (
                <Select
                  {...{ name, isMulti }}
                  inputId={`input_${name}`}
                  className="react-select-styled react-select-solid border border-gray-100 rounded"
                  classNamePrefix="react-select"
                  placeholder="請選擇或輸入關鍵字"
                  options={hoistPreLoadData.get()[name]}
                  defaultValue={
                    isMulti
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
                  onChange={(options) => {
                    formik.setFieldValue(
                      name,
                      Array.isArray(options)
                        ? options.map((option) => option.value)
                        : options.value
                    );
                  }}
                />
              ) : (
                <div className="form-select form-select-solid text-gray-500">
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
        }[type]
      }
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

const TextInput = (props) => ValidateInputField({ ...props, type: "text" });
const TextHolder = () => ValidateInputField({ holder: true });
const NumberInput = (props) =>
  ValidateInputField({ ...props, onlynumber: true });

const SelectInput = (props) => ValidateInputField({ ...props, type: "select" });
const MultiSelectInput = (props) =>
  ValidateInputField({ ...props, type: "select", isMulti: true });
const TextareaInput = (props) =>
  ValidateInputField({ ...props, type: "textarea" });

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
      {hoistFormik.get()?.errors[props.name] && (
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
        {hoistFormik.get()?.values[props.name]?.map(({ id, src }) => (
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
                const prevImages = hoistFormik.get().values[props.name];
                hoistFormik.get().setFieldValue(
                  props.name,
                  prevImages.filter((image) => image.id !== id)
                );
              }}
            ></span>
          </div>
        ))}
        {!!hoistFormik.get()?.values[props.name]?.length || (
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
            const prevImages = hoistFormik.get().values[props.name] || [];
            hoistFormik
              .get()
              .setFieldValue(props.name, [...prevImages, ...images]);
          }}
        />
      </label>
    </div>
  );
};

const PriceTable = (props) => {
  return (
    <div>
      <InputLabel
        htmlFor={`image_${props.name}`}
        className="p-1 cursor-pointer align-self-start"
        required={props.required}
        text={props.label}
      />
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
                <div className="bg-gray-500 text-white text-center p-2">
                  {name}
                </div>
                <div className="p-5">
                  <NumberInput
                    name={`${props.name}_${id}`}
                    inputclassname="border"
                    onChange={(e) => console.log(e.target.value)}
                    defaultValue={price}
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
    </div>
  );
};

const EditorField = (props) => (
  <div>
    <InputLabel text={props.label} required={props.required} />
    <CustomEditor />
  </div>
);

const inputDictionary = {
  text: TextInput,
  "label-holder": LabelHolder,
  "text-holder": TextHolder,
  number: NumberInput,
  switch: SwitchInput,
  image: ImageInput,
  "multi-image": MultiImageInput,
  "price-table": PriceTable,
  editor: EditorField,
  select: SelectInput,
  "multi-select": MultiSelectInput,
  textarea: TextareaInput,
};
const createRowColTree = (arr) =>
  arr.map((group, groupIndex) => {
    return (
      <Row className="mb-5 g-6" key={groupIndex}>
        {toArray(group).map((input, inputIndex) => {
          if (Array.isArray(input))
            return <Col key={inputIndex}>{createRowColTree(input)}</Col>;
          const Input = inputDictionary[input.type];
          if (!Input) return false;

          return (
            <Col sm={input.col} key={inputIndex} className="">
              <Input
                name={input.name}
                label={input.label}
                required={input.required}
                {...input.props}
              />
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
    if (itemIdForUpdate === null) return "create";
    if (!isNaN(parseInt(itemIdForUpdate))) return "edit";
    return "close";
  })();

  const createMode = currentMode === "create";
  const editMode = currentMode === "edit";

  const tableName = currentTable.get();
  const fields =
    inputList?.[tableName] || (!console.warn("No input list provided.") && []);
  const preLoadList = preLoad[tableName] || [];
  const { tableData, preLoadData, setPreLoadData } = useTableData();

  const [initialValues, setInitialValues] = useState(
    (() => {
      if (createMode) return formField[tableName];

      const currentData = tableData.find((data) => data.id === itemIdForUpdate);

      return Object.keys(formField[tableName]).reduce((result, key) => {
        result[key] = currentData[key];
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
      await {
        async create() {
          // return console.log(values);
          await createDataRequest(token, values);
          setPopupSet({
            message: "新增成功",
            icon: "/icon/check-circle.svg",
          });
          handleShowModal("popup");
        },
        async edit() {
          // return console.log(values);
          await updateDataRequest(token, {
            ...values,
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

  const closeModal = () => setItemIdForUpdate(undefined);

  /**
   * handle preLoad data
   * Note that actual use data is hoistPreLoadData not preLoadData
   * preLoadData is use for cache
   */
  useEffect(() => {
    (async () => {
      if (preLoadList.length === 0) return;
      await Promise.all(
        preLoadList.map(async ({ name, fetchUrl, adaptor, initializer }) => {
          const rawData = await (async () => {
            if (preLoadData[name]) return preLoadData[name];
            const res = await getAllData(token, fetchUrl);
            if (!res || !res.data) return false;
            setPreLoadData((pre) => ({ ...pre, [name]: res.data }));
            return res.data;
          })();
          if (!rawData) return;

          const data =
            typeof adaptor === "function" ? adaptor(rawData) : rawData;
          // handle initial values for create mode
          createMode &&
            formik.setFieldValue(
              name,
              typeof initializer === "function" ? initializer(data) : data
            );

          hoistPreLoadData.set({ ...hoistPreLoadData.get(), [name]: data });
        })
      );
    })();
  }, []);

  return (
    <>
      <form
        id="kt_modal_add_user_form"
        className="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="mb-7 d-flex">
          <div className="bg-secondary px-5 py-2 border rounded-1">
            <span className="">注意 :</span>
            <span className="text-danger  px-3">*</span>
            <span className="">為必填欄位</span>
          </div>
        </div>
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

        {/* begin::Actions */}
        <div className="text-center pt-15">
          <button
            type="reset"
            onClick={() => closeModal()}
            className="btn btn-secondary me-3"
            data-kt-users-modal-action="cancel"
            disabled={formik.isSubmitting}
          >
            取消
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            data-kt-users-modal-action="submit"
            disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className="indicator-label">確認</span>
            {formik.isSubmitting && (
              <span className="indicator-progress">
                Please wait...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
          {/*新增 和 編輯完成*/}
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
        </div>
        {/* end::Actions */}
      </form>
    </>
  );
};

export { EditModalForm };
