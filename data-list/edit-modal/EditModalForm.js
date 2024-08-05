import { useState, useEffect } from "react";

import { useRouter } from "next/router";

import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";

import { Row, Col } from "react-bootstrap";

import { useFormik } from "formik";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { useTableData } from "../core/tableDataProvider";

import { useSession } from "next-auth/react";

const testMode = false;

import currentTable from "../globalVariable/currentTable";
import dict from "../dictionary/tableDictionary";
import { useModals } from "@/tool/hooks";
import { toArray } from "@/tool/helper";

import {
  createDataRequest,
  updateDataRequest,
  regularReadData,
} from "../core/request";

import { hoistFormik, hoistPreLoadData } from "./globalVariable";

import {
  LabelHolder,
  TextHolder,
  CheckBoxInput,
  NumberInput,
  MultiSelectInput,
  SwitchInput,
  ImageInput,
  MultiImageInput,
  Button,
  generateInputs,
} from "./components/input";

import PriceTable from "./components/PriceTable";
import EditorField from "./components/EditorField";
import SaleMember from "./components/SaleMember";
import SaleStockList from "./components/SaleStockList";
import SalePersonList from "./components/SalePersonList";
import SaleSeparate from "./components/SaleSeparate";

const {
  inputList = {},
  formField = {},
  validationSchema = {},
  preLoad = {},
  editAdaptor = {},
  submitAdaptor = {},
  hideSubmitField = {},
  hidePromptField = {},
} = dict;

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
  "sale-separate": SaleSeparate,
  button: Button,
  /** "submit-field" will be automatically append when editForm rendered */
};

const createRowColTree = (arr) =>
  !Array.isArray(arr)
    ? console.warn("`createRowColTree` must receive an array.")
    : arr.map((group, groupIndex) => {
        return (
          <Row className={group.className ?? "mb-5 g-6"} key={groupIndex}>
            {toArray(group).map((input, inputIndex) => {
              if (Array.isArray(input))
                return (
                  <Col
                    sm={input.col}
                    key={inputIndex}
                    className={input.className}
                  >
                    {createRowColTree(input)}
                  </Col>
                );
              const Input = inputDictionary[input.type];
              if (!Input && !input.node) return false;

              return (
                <Col
                  sm={input.col}
                  key={inputIndex}
                  className={input.className}
                >
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
  // console.log("===== formik ======", formik);

  const closeModal = () => setItemIdForUpdate(undefined);
  inputDictionary["submit-field"] = (props) => (
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
