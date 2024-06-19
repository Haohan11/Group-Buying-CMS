import React from "react";
import { useState, useEffect, useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { KTSVG } from "@/_metronic/helpers/index";
import Select from "react-select";
import Stars from "@/components/input/starsRating";
import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";

import { Row, Col, FormCheck } from "react-bootstrap";
import { useFormik } from "formik";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { useTableData } from "../core/tableDataProvider";

import { useSession } from "next-auth/react";

import currentTable from "../globalVariable/currentTable";
import dict from "../dictionary/tableDictionary";
import { useInputFilePath, useModals } from "@/tool/hooks";
import {
  transImageUrl,
  getFileUrl,
  loopObject,
  onlyInputNumbers,
} from "@/tool/helper";

import {
  createDataRequest,
  updateDataRequest,
  getDataByTable,
} from "../core/request";

const { modalConfig, formField, validationSchema } = dict;

const InputLabel = ({ required, text, className, ...props }) => (
  <label
    {...props}
    className={clsx("fw-bold fs-6 mb-2", {
      required,
    }, className)}
  >
    {text}
  </label>
);

const hostFormik = {
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

const ValidateInputField = ({
  required = false,
  label,
  name,
  formik = hostFormik.get(),
  placeholder,
  inputclassname = "",
  type = "text",
  readonly = false,
  onlynumber = false,
}) => (
  <>
    <InputLabel required={required} text={label} />
    <input
      {...formik.getFieldProps(name)}
      placeholder={placeholder}
      className={clsx(
        "form-control form-control-solid mb-3 mb-lg-0",
        inputclassname,
        { "is-invalid": formik?.touched[name] && formik?.errors[name] },
        { "is-valid": formik?.touched[name] && !formik?.errors[name] }
      )}
      type={type}
      name={name}
      autoComplete="off"
      {...(onlynumber && {
        onKeyDown: onlyInputNumbers,
      })}
      disabled={readonly || formik?.isSubmitting}
    />
    {formik?.touched[name] && formik?.errors[name] && (
      <div className="fv-plugins-message-container">
        <div className="fv-help-block">
          <span role="alert">{formik?.errors[name]}</span>
        </div>
      </div>
    )}
  </>
);

const TextInput = (props) => ValidateInputField({ ...props, type: "text" });
const NumberInput = (props) =>
  ValidateInputField({ ...props, onlynumber: true });

const SwitchInput = (props) => (
  <div className="w-100 d-flex">
    <label
      htmlFor={`switch_${props.name}`}
      className="fw-bold fs-6 cursor-pointer me-3"
    >
      {props.label}
    </label>

    <FormCheck
      className={"ms-auto me-10"}
      {...hostFormik.get().getFieldProps(props.name)}
      inline
      type="switch"
      defaultChecked={hostFormik.get().getFieldProps(props.name).value}
      id={`switch_${props.name}`}
      name={props.name}
    />
  </div>
);

const ImageInput = (props) => {
  return (
    <div className="">
      <InputLabel htmlFor={`image_${props.name}`} className="d-block p-1 cursor-pointer" required={props.required} text={props.label}/>
      <label
        className="position-relative bg-gray-100 rounded-3 cursor-pointer overflow-hidden shadow-sm"
        style={{ width: "100px", height: "100px" }}
        htmlFor={`image_${props.name}`}
      >
        {hostFormik.get()?.values[`${props.name}_preview`] && (
          <Image
            sizes="100px"
            fill
            className="top-0 start-0 object-fit-cover"
            src={hostFormik.get().values[`${props.name}_preview`]}
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
            hostFormik.get().setFieldValue(`${props.name}_preview`, src);
            hostFormik.get().setFieldValue(props.name, file);
          }}
        />
      </label>
    </div>
  );
};

const inputDictionary = {
  text: TextInput,
  number: NumberInput,
  switch: SwitchInput,
  image: ImageInput,
};

const EditModalForm = ({ isUserLoading }) => {
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
  const config = modalConfig[tableName];
  const { tableData } = useTableData();

  const currentData = editMode
    ? tableData.find((data) => data.id === itemIdForUpdate)
    : null;

  const handleCurrentData = (data) => data;

  const [initialValues, setInitialValues] = useState({
    ...formField[tableName],
    ...(currentData !== null && handleCurrentData(currentData)),
  });

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
          return console.log(values);
          await createDataRequest(token, values);
          setPopupSet({
            message: "新增成功",
            icon: "/icon/check-circle.svg",
          });
          handleShowModal("popup");
        },
        async edit() {
          return console.log(values);
          await updateDataRequest(token, {
            ...flatColorImagesField(values),
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
  hostFormik.set(formik);

  const closeModal = () => setItemIdForUpdate(undefined);

  // re assign inital value with keep old input fields values

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
          {config.inputList.map((group, groupIndex) => {
            return (
              <Row className="mb-5 g-5" key={groupIndex}>
                {group.map((input, inputIndex) => {
                  const Input = inputDictionary[input.type];
                  if (!Input) return false;

                  return (
                    <Col key={inputIndex} sm={6} className="">
                      <Input
                        name={input.name}
                        label={input.label}
                        required={input.required}
                      />
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </div>

        {/* begin::Actions */}
        <div className="text-center pt-15">
          <button
            type="reset"
            onClick={() => closeModal()}
            className="btn btn-secondary me-3"
            data-kt-users-modal-action="cancel"
            disabled={formik.isSubmitting || isUserLoading}
          >
            取消
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            data-kt-users-modal-action="submit"
            disabled={
              isUserLoading ||
              formik.isSubmitting ||
              !formik.isValid ||
              !formik.touched
            }
          >
            <span className="indicator-label">確認</span>
            {(formik.isSubmitting || isUserLoading) && (
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
