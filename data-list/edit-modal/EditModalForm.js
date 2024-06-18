import React from "react";
import { useState, useEffect, useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { KTSVG } from "@/_metronic/helpers/index";
import Select from "react-select";
import Stars from "@/components/input/starsRating";
import ModalWrapper from "@/components/modalWrapper";
import PopUp from "@/components/popUp";

import { FormCheck } from "react-bootstrap";
import { useFormik } from "formik";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { useTableData } from "../core/tableDataProvider";

import { useSession } from "next-auth/react";

import currentTable from "../globalVariable/currentTable";
import dict from "../dictionary/tableDictionary";
import { useInputFilePath, useModals } from "@/tool/hooks";
import { transImageUrl, getFileUrl, loopObject, onlyInputNumbers } from "@/tool/helper";

import {
  createDataRequest,
  updateDataRequest,
  getDataByTable,
} from "../core/request";

const { modalConfig, formField, validationSchema } = dict;

const InputLabel = ({ required, text }) => (
  <label
    className={clsx("fw-bold fs-6 mb-2", {
      required: required,
    })}
  >
    {text}
  </label>
);

const ValidateInputField = ({
  required = false,
  label,
  name,
  formik,
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

const flatColorImagesField = (stockData) =>
  Object.entries(stockData).reduce((dict, [key, value]) => {
    if (!key.includes("colorImages")) return { ...dict, [key]: value };
    if (!key.split("_")[1]) return { ...dict, [key]: value };
    return {
      ...dict,
      ...{
        [`${key}_0`]: value[0],
        [`${key}_1`]: value[1],
        [`${key}_2`]: value[2],
      },
    };
  }, {});

const EditModalForm = ({ isUserLoading }) => {
  const { data, status } = useSession();
  const token = data?.user?.accessToken;

  const router = useRouter();
  const { setItemIdForUpdate, itemIdForUpdate } = useListView();

  const currentMode = (() => {
    if (itemIdForUpdate === null) return "create";
    if (!isNaN(parseInt(itemIdForUpdate))) return "edit";
    if (itemIdForUpdate === undefined) return "close";
  })();

  const createMode = currentMode === "create";
  const editMode = currentMode === "edit";

  const tableName = currentTable.get();
  const config = modalConfig[tableName];
  const { tableData } = useTableData();

  const currentData = editMode
    ? tableData.find((data) => data.id === itemIdForUpdate)
    : null;
  const handleCurrentData = (data) => {
    const {
      series,
      supplier,
      design,
      material,
      environment,
      description,
      colorList,
    } = data;
    return {
      ...data,
      series: series?.id || series,
      supplier: supplier?.id || supplier,
      ...loopObject({ design, material, environment }, (field) =>
        Array.isArray(field) ? field.map((item) => `${item.id}`) : field
      ),
      description: description || "",
      ...(colorList
        ? {
            colorList: colorList.map(
              ({
                stock_image,
                color_image,
                removal_image,
                colorSchemeList,
                ...color
              }) => ({
                ...color,
                // for default colorScheme select
                colorSchemeList: colorSchemeList.map((scheme) => ({
                  label: scheme.name,
                  value: scheme.id,
                })),
                // for submit colorSchemes data
                colorSchemes: colorSchemeList.map((scheme) => scheme.id),
                ...loopObject(
                  { stock_image, color_image, removal_image },
                  (image) => transImageUrl(image)
                ),
              })
            ),
          }
        : {}),
    };
  };
  const [initialValues, setInitialValues] = useState({
    ...formField[tableName],
    ...(currentData === null ? {} : handleCurrentData(currentData)),
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

  const colorRowCount = useRef(0);
  const [colorImagePath, setColorImagePath] = useState([
    { index: 0, imagePath: [...Array(3)] },
  ]);
  const imagesValid = {
    create: () => {
      if (tableName !== "stock") return true;

      if (colorImagePath.length === 0) return false;

      if (
        colorImagePath.length === 1 &&
        colorImagePath[0].imagePath.some((file) => !file)
      )
        return false;

      return !colorImagePath.some((cp) =>
        [1, 2].includes(cp.imagePath.filter((file) => !file).length)
      );
    },
    edit: () => {
      if (tableName !== "stock") return true;

      const colorList = formik.values["colorList"];
      if (colorList.length === 0) return false;

      if (colorList.length === 1) {
        const { stock_image, color_image, removal_image } = colorList[0];
        return ![stock_image, color_image, removal_image].some((img) => !img);
      }

      return !colorList.some((row) => {
        const { stock_image, color_image, removal_image } = row;
        return [1, 2].includes(
          [stock_image, color_image, removal_image].filter((file) => !file)
            .length
        );
      });
    },
  }[currentMode]();

  const addColorRow = () => {
    const newIndex = (colorRowCount.current += editMode ? -1 : 1);
    ({
      create: () => {
        setColorImagePath((prev) => [
          ...prev,
          { index: newIndex, imagePath: [...Array(3)] },
        ]);
        formik.setValues((prev) => ({
          ...prev,
          [`color_${newIndex}`]: color[0]?.id,
          [`colorScheme_${newIndex}`]: colorScheme[0]?.id,
        }));
      },
      edit: () => {
        formik.setFieldValue("colorList", [
          ...formik.values["colorList"],
          {
            id: newIndex,
            name: color[0].name,
            color_name_id: color[0].id,
            colorSchemeList: [
              { label: colorScheme[0].name, value: colorScheme[0].id },
            ],
            colorSchemes: [colorScheme[0].id],
          },
        ]);
      },
    })[currentMode]();
  };

  const removeColorRow = (index) => {
    ({
      create() {
        setColorImagePath((prev) =>
          prev.filter((item) => item.index !== index)
        );
        formik.setValues((prev) => {
          const newValues = { ...prev };
          delete newValues[`colorScheme_${index}`];
          delete newValues[`color_${index}`];
          return newValues;
        });
      },
      edit() {
        formik.setValues((prev) => {
          const newValues = { ...prev };
          delete newValues[`colorImage_${index}`];
          newValues["colorList"] = newValues["colorList"].filter(
            (color) => color.id !== index
          );
          return newValues;
        });
      },
    })[currentMode]();
  };

  // for create mode adding preview image url
  const addImageUrl = (event, index, input_index) => {
    const url = getFileUrl(event);
    if (!url) return;
    setColorImagePath((prev) =>
      prev.map((item) =>
        item.index === index
          ? {
              ...item,
              imagePath: item.imagePath.map((path, pathIndex) =>
                pathIndex === input_index ? url : path
              ),
            }
          : item
      )
    );
  };

  const [series, setSeries] = useState([]);
  const seriesIsEmpty = series.length === 0;

  const [supplier, setSupplier] = useState([]);
  const supplierIsEmpty = supplier.length === 0;

  const [colorScheme, setColorScheme] = useState([]);
  const colorSchemeIsEmpty = colorScheme.length === 0;

  const [color, setColor] = useState([]);
  const colorIsEmpty = color.length === 0;

  const [material, setMaterial] = useState([]);
  const materialIsEmpty = material.length === 0;

  const [design, setDesign] = useState([]);
  const designIsEmpty = design.length === 0;

  const [environment, setEnvironment] = useState([]);
  const environmentIsEmpty = environment.length === 0;

  const [permission, setPermission] = useState([]);
  const permissionIsEmpty = permission.length === 0;

  const [employee, setEmployee] = useState([]);
  const employeeIsEmpty = employee.length === 0;

  const [role, setRole] = useState([]);
  const roleIsEmpty = role.length === 0;

  const [avatarSrc, handleAvatarChoose] = useInputFilePath();

  const closeModal = () => {
    setItemIdForUpdate(undefined);
  };

  useEffect(() => {
    (async () => {
      fetchSeries: if (config.series_label) {
        const res = await getDataByTable(token, "series");
        if (res === false) break fetchSeries;

        const { data: list } = res;
        const enableList = list?.filter((item) => item.enable);
        setSeries(enableList);
      }

      fetchSupplier: if (config.supplier_label) {
        const res = await getDataByTable(token, "supplier");
        if (res === false) break fetchSupplier;

        const { data: list } = res;
        const enableList = list?.filter((item) => item.enable);
        setSupplier(enableList);
      }

      if (config.color_label) {
        fetchColorScheme: {
          const res = await getDataByTable(token, "colorScheme");
          if (res === false) break fetchColorScheme;

          const { data: list } = res;
          const enableList = list?.filter((item) => item.enable);
          setColorScheme(enableList);
        }
        fetchColor: {
          const res = await getDataByTable(token, "color");
          if (res === false) break fetchColor;

          const { data: list } = res;
          const enableList = list?.filter((item) => item.enable);
          setColor(enableList);
        }
      }

      fetchMaterial: if (config.material_label) {
        const res = await getDataByTable(token, "material");
        if (res === false) break fetchMaterial;

        const { data: list } = res;
        const enableList = list?.filter((item) => item.enable);
        setMaterial(enableList);
      }

      fetchDesign: if (config.design_label) {
        const res = await getDataByTable(token, "design");
        if (res === false) break fetchDesign;

        const { data: list } = res;
        const enableList = list?.filter((item) => item.enable);
        setDesign(enableList);
      }

      fetchEnvironment: if (config.environment_label) {
        const res = await getDataByTable(token, "environment");
        if (res === false) break fetchEnvironment;

        const { data: list } = res;
        const enableList = list?.filter((item) => item.enable);
        setEnvironment(enableList);
      }

      fetchPermission: if (config.permission_label) {
        const res = await getDataByTable(token, "permission");
        if (res === false) break fetchPermission;

        const { data: list } = res;
        setPermission(list);
      }

      fetchEmployee: if (config.members_label) {
        const res = await getDataByTable(token, "accounts");
        if (res === false) break fetchEmployee;

        const { data: list } = res;
        setEmployee(list);
      }

      fetchRole: if (config.role_label) {
        const res = await getDataByTable(token, "role");
        if (res === false) break fetchRole;

        const { data: list } = res;
        setRole(list);
      }
    })();
  }, []);

  // re assign inital value with keep old input fields values
  useEffect(() => {
    setInitialValues({
      ...formik.values,
      series: formik.values["series"] || series[0]?.id || "",
      ...(createMode &&
        colorImagePath.reduce((dict, { index }) => {
          dict[`color_${index}`] =
            formik.values[`color_${index}`] || color[0]?.id;
          dict[`colorScheme_${index}`] = [
            formik.values[`colorScheme_${index}`]?.[0] || colorScheme[0]?.id,
          ];
          return dict;
        }, {})),
      ...(createMode && {
        permission: (() => {
          const getId = (dict, per) => {
            dict[per.id] = false;
            Array.isArray(per.childs) && per.childs.reduce(getId, dict);
            return dict;
          };

          return permission.reduce(getId, {});
        })(),
      }),
      ...(createMode && !roleIsEmpty && { role: role[0].id }),
    });
  }, [colorScheme, series, color, permission, role]);

  return (
    <>
      <form
        id="kt_modal_add_user_form"
        className="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {/* begin::Scroll */}
        <div className="mb-7 d-flex">
          <div className="bg-secondary px-5 py-2 border rounded-1">
            <span className="">注意 :</span>
            <span className="text-danger  px-3">*</span>
            <span className="">為必填欄位</span>
          </div>
        </div>
        <div
          className="d-flex flex-column scroll-y-auto"
          id="kt_modal_add_user_scroll"
          data-kt-scroll="true"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-max-height="auto"
          data-kt-scroll-dependencies="#kt_modal_add_user_header"
          data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
          data-kt-scroll-offset="300px"
        >
          {config.avatar && (
            <div className="fv-row mb-7">
              {/* begin::Label */}
              <label className="d-block fw-bold fs-6 mb-5">大頭貼照</label>
              {/* end::Label */}

              {/* begin::Image input */}
              <div
                className="image-input image-input-outline"
                data-kt-image-input="true"
              >
                {/* begin::Preview existing avatar */}
                <div
                  className="image-input-wrapper w-125px h-125px"
                  style={{ backgroundImage: `url('${avatarSrc}')` }}
                ></div>
                {/* end::Preview existing avatar */}

                {/* begin::Label */}
                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Change avatar"
                >
                  <i className="bi bi-pencil-fill fs-7"></i>

                  <input
                    type="file"
                    name="avatar"
                    accept=".png, .jpg, .jpeg"
                    onInput={handleAvatarChoose}
                  />
                  <input type="hidden" name="avatar_remove" />
                </label>
                {/* end::Label */}
              </div>
              {/* end::Image input */}

              {/* begin::Hint */}
              {/* <div className='form-text'>Allowed file types: png, jpg, jpeg.</div> */}
              {/* end::Hint */}
            </div>
          )}

          {(config.name_label ||
            config.enable_label ||
            config.available_label) && (
            <div className="d-flex mb-7">
              {config.name_label && (
                <div className="fv-row flex-grow-1">
                  <ValidateInputField
                    required={config.name_required}
                    name="name"
                    label={config.name_label}
                    placeholder={config.name_placeholder || "請輸入"}
                    formik={formik}
                  />
                </div>
              )}

              {(config.enable_label || config.available_label) && (
                <div className="fv-row ms-5 flex-grow-1 align-self-center text-end">
                  <label
                    htmlFor="available-switch"
                    className="fw-bold fs-6 mb-2 cursor-pointer"
                  >
                    {config.enable_label || config.available_label}
                  </label>

                  <FormCheck
                    {...formik.getFieldProps(
                      config.enable_label ? "enable" : "available"
                    )}
                    inline
                    type="switch"
                    defaultChecked={
                      currentData === null
                        ? formik.getFieldProps(
                            config.enable_label ? "enable" : "available"
                          ).value
                        : currentData[
                            config.enable_label ? "enable" : "available"
                          ]
                    }
                    id="available-switch"
                    name={config.enable_label ? "enable" : "available"}
                    className={"ms-2"}
                    disabled={formik.isSubmitting || isUserLoading}
                  />
                </div>
              )}
            </div>
          )}

          {(config.code_label || config.email || config.series_label) && (
            <div className="d-flex">
              {config.code_label && (
                <div className="fv-row mb-7 flex-grow-1">
                  <ValidateInputField
                    required={config.code_required}
                    label={config.code_label}
                    placeholder={config.code_placeholder || "輸入編號"}
                    readonly={config.code_read_only}
                    name={"code"}
                    formik={formik}
                  />
                </div>
              )}

              {config.email && (
                <div className="fv-row mb-7 ms-3 flex-grow-1">
                  <ValidateInputField
                    required={config.email_required}
                    label={"電子郵箱"}
                    type="email"
                    placeholder={"輸入 Email"}
                    name={"email"}
                    formik={formik}
                  />
                  {void (formik.values["oldEmail"] = initialValues["email"])}
                </div>
              )}

              {config.series_label && (
                <div className="fv-row flex-grow-1 ms-5">
                  <label className="fw-bold fs-6 mb-2">
                    {config.series_label}
                  </label>
                  <select
                    {...formik.getFieldProps("series")}
                    className={clsx(
                      "form-select form-select-solid mb-3 mb-lg-0"
                    )}
                    name="series"
                    disabled={formik.isSubmitting || isUserLoading}
                  >
                    {seriesIsEmpty ? (
                      <option disabled>目前沒有資料</option>
                    ) : (
                      series.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}
            </div>
          )}

          {(config.id_code_label || config.phone_number_label) && (
            <div className="d-flex mb-7">
              {config.id_code_label && (
                <div className="fv-row flex-grow-1">
                  <ValidateInputField
                    required={config.id_code_required}
                    label={config.id_code_label}
                    placeholder={config.id_code_placeholder}
                    inputclassname={"text-uppercase"}
                    name={"id_code"}
                    formik={formik}
                  />
                </div>
              )}

              {config.phone_number_label && (
                <div className="fv-row flex-grow-1 ms-3">
                  <ValidateInputField
                    required={config.phone_number_required}
                    label={config.phone_number_label}
                    placeholder={config.phone_number_placeholder}
                    name={"phone_number"}
                    formik={formik}
                    onlynumber
                  />
                </div>
              )}
            </div>
          )}

          {config.password_label && (
            <div className="fv-row mb-7">
              <ValidateInputField
                required={!editMode && config.password_required}
                label={
                  <>
                    {config.password_label}
                    {editMode && (
                      <span
                        className="ms-2 fw-normal"
                        style={{ color: "grey" }}
                      >
                        ( 不更改請留空 )
                      </span>
                    )}
                  </>
                }
                type="password"
                placeholder={config.password_placeholder}
                name={"password"}
                formik={formik}
              />
              {
                (formik.values["preserve"] = !(
                  createMode || formik.values["password"]?.length > 0
                ))
              }
            </div>
          )}

          {config.role_label && (
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">{config.role_label}</label>
              <select
                key={roleIsEmpty}
                className={clsx("form-select form-select-solid mb-3 mb-lg-0")}
                defaultValue={formik.values["role"]}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  !isNaN(value) && formik.setFieldValue("role", value);
                }}
              >
                {roleIsEmpty ? (
                  <option disabled>目前沒有資料</option>
                ) : (
                  role.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {config.supplier_label && (
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">
                {config.supplier_label}
              </label>

              <select
                {...formik.getFieldProps("supplier")}
                className={clsx("form-select form-select-solid mb-3 mb-lg-0")}
                name="supplier"
                disabled={formik.isSubmitting || isUserLoading}
              >
                {supplierIsEmpty ? (
                  <option disabled>目前沒有資料</option>
                ) : (
                  [
                    <option key={"choose_supplier"} value="">
                      請選擇
                    </option>,
                    ...supplier.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    )),
                  ]
                )}
              </select>
            </div>
          )}

          {config.color_label && (
            <div className="fv-row mb-7">
              <InputLabel text={config.color_label} required />
              <div className="row gy-4 mb-3">
                {{
                  create: colorImagePath,
                  edit: formik.values["colorList"],
                  close: [],
                }[currentMode].map(
                  ({
                    id,
                    index,
                    imagePath,
                    stock_image,
                    color_image,
                    removal_image,
                    colorSchemeList,
                    colorSchemes,
                    name,
                    color_name_id,
                  }) => (
                    <div key={id ?? index} className="d-flex">
                      {["商品圖片", "顏色圖片", "去背圖片"].map(
                        (text, input_index) => (
                          <label
                            key={`color-image_${id ?? index}_${input_index}`}
                            className={`d-block ${
                              input_index !== 0 ? "ms-3 " : ""
                            }h-100px w-100px cursor-pointer position-relative`}
                            style={{ aspectRatio: "1" }}
                          >
                            {{
                              create: imagePath?.[input_index],
                              edit: [stock_image, color_image, removal_image][
                                input_index
                              ],
                              close: "",
                            }[currentMode] ? (
                              <Image
                                className="rounded-4 object-fit-cover"
                                fill
                                sizes="100px"
                                src={
                                  {
                                    create: imagePath?.[input_index],
                                    edit: [
                                      stock_image,
                                      color_image,
                                      removal_image,
                                    ][input_index],
                                    close: "",
                                  }[currentMode]
                                }
                                alt="color image"
                              />
                            ) : (
                              <div className="flex-center h-100 border border-2 rounded-4 bg-secondary">
                                {text}
                              </div>
                            )}
                            <input
                              type="file"
                              accept=".png, .jpg, .jpeg"
                              hidden
                              onChange={(event) => {
                                const file = event.target.files[0];
                                if (!file) return;
                                ({
                                  create() {
                                    addImageUrl(event, index, input_index);
                                    const files =
                                      [...formik.values["colorImages"]] || [];
                                    files[index * 3 + input_index] = file;
                                    formik.setFieldValue("colorImages", files);
                                  },
                                  edit() {
                                    const colorList =
                                      formik.values["colorList"];
                                    const url = getFileUrl(event);
                                    formik.setFieldValue(
                                      "colorList",
                                      colorList.map((color) =>
                                        color.id === id
                                          ? {
                                              ...color,
                                              ...[
                                                { stock_image: url },
                                                { color_image: url },
                                                { removal_image: url },
                                              ][input_index],
                                            }
                                          : color
                                      )
                                    );

                                    const colorImagesList = Array.isArray(
                                      formik.values[`colorImages_${id}`]
                                    )
                                      ? formik.values[`colorImages_${id}`]
                                      : [...Array(3)];
                                    formik.setFieldValue(
                                      `colorImages_${id}`,
                                      colorImagesList.map((oldFile, index) =>
                                        index === input_index ? file : oldFile
                                      )
                                    );
                                  },
                                })[currentMode]();
                              }}
                            />
                          </label>
                        )
                      )}
                      <div className="ms-3 flex-grow-1">
                        {!colorIsEmpty ? (
                          <Select
                            className={clsx(
                              "react-select-styled react-select-solid mb-3"
                            )}
                            classNamePrefix="react-select"
                            defaultValue={
                              editMode
                                ? { label: name, value: color_name_id }
                                : { label: color[0].name, value: color[0].id }
                            }
                            options={color.map((c) => ({
                              label: c.name,
                              value: c.id,
                            }))}
                            name={`color_${index}`}
                            onChange={(colorName) => {
                              ({
                                create() {
                                  formik.setFieldValue(
                                    `color_${index}`,
                                    colorName.value
                                  );
                                },
                                edit() {
                                  formik.setFieldValue(
                                    "colorList",
                                    formik.values["colorList"].map((color) =>
                                      color.id === id
                                        ? {
                                            ...color,
                                            name: colorName.label,
                                            color_name_id: colorName.value,
                                          }
                                        : color
                                    )
                                  );
                                },
                              })[currentMode]();
                            }}
                            disabled={formik.isSubmitting || isUserLoading}
                          />
                        ) : (
                          <div className="form-select form-select-solid mb-3">
                            目前沒有資料
                          </div>
                        )}
                        {!colorSchemeIsEmpty ? (
                          <Select
                            className={clsx(
                              "react-select-styled react-select-solid"
                            )}
                            classNamePrefix="react-select"
                            defaultValue={
                              editMode
                                ? colorSchemeList
                                : {
                                    label: colorScheme[0].name,
                                    value: colorScheme[0].id,
                                  }
                            }
                            isMulti
                            options={colorScheme.map((cs) => ({
                              label: cs.name,
                              value: cs.id,
                            }))}
                            name={`colorScheme_${index}`}
                            onChange={(colorss) => {
                              ({
                                create() {
                                  formik.setFieldValue(`colorScheme_${index}`, [
                                    ...colorss.map((colors) => colors.value),
                                  ]);
                                },
                                edit() {
                                  // notice the colorSchemes is inside color item in colorList not colorScheme state
                                  formik.setFieldValue(
                                    "colorList",
                                    formik.values["colorList"].map((color) =>
                                      color.id === id
                                        ? {
                                            ...color,
                                            colorSchemes: [
                                              ...colorss.map(
                                                (colors) => colors.value
                                              ),
                                            ],
                                          }
                                        : color
                                    )
                                  );
                                },
                              })[currentMode]();
                            }}
                            disabled={formik.isSubmitting || isUserLoading}
                          />
                        ) : (
                          <div className="form-select form-select-solid">
                            目前沒有資料
                          </div>
                        )}
                      </div>
                      <div
                        className="cursor-pointer align-self-center"
                        onClick={() => removeColorRow(id ?? index)}
                      >
                        <KTSVG
                          path={"/media/icons/duotune/general/gen034.svg"}
                          className="ms-2 svg-icon-muted svg-icon-2hx"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
              <div
                className="flex-center h-100 border border-2 rounded-4 bg-light-secondary p-8 cursor-pointer"
                onClick={addColorRow}
              >
                <KTSVG
                  path="/media/icons/duotune/general/gen035.svg"
                  className="svg-icon-muted svg-icon-2hx me-2"
                />
                新增商品顏色
              </div>
              {!imagesValid && (
                <div className="pt-2 text-danger">請提供正確數量的圖片</div>
              )}
            </div>
          )}

          {config.material_label && (
            <div className="mb-7">
              <div className="fw-bold fs-6 mb-2">{config.material_label}</div>
              <div className="d-flex flex-wrap justify-content-start">
                {materialIsEmpty ? (
                  <div className="w-100 text-center bg-secondary p-2 rounded-2">
                    目前沒有資料
                  </div>
                ) : (
                  material.map((item) => (
                    <label
                      key={item.id}
                      className="me-2 mb-2 tags-label cursor-pointer"
                    >
                      <input
                        {...formik.getFieldProps("material")}
                        defaultChecked={formik.values["material"].includes(
                          `${item.id}`
                        )}
                        type="checkbox"
                        name="material"
                        value={item.id}
                        hidden
                      />
                      <div className="fs-4 py-2 px-5 border border-2 rounded-2">
                        {item.name}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {config.design_label && (
            <div className="mb-7">
              <div className="fw-bold fs-6 mb-2">{config.design_label}</div>
              <div className="d-flex flex-wrap justify-content-start">
                {designIsEmpty ? (
                  <div className="w-100 text-center bg-secondary p-2 rounded-2">
                    目前沒有資料
                  </div>
                ) : (
                  design.map((item) => (
                    <label
                      key={item.id}
                      className="me-2 mb-2 tags-label cursor-pointer"
                    >
                      <input
                        {...formik.getFieldProps("design")}
                        defaultChecked={formik.values["design"].includes(
                          `${item.id}`
                        )}
                        type="checkbox"
                        name="design"
                        value={item.id}
                        hidden
                      />
                      <div className="fs-4 py-2 px-5 border border-2 rounded-2">
                        {item.name}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {config.absorption_label && (
            <div className="row mb-7">
              <div className="col">
                <label className="fw-bold fs-6 mb-2">
                  {config.absorption_label}
                </label>
                <Stars
                  {...formik.getFieldProps("absorption")}
                  width={50}
                  name="absorption"
                />
              </div>
              <div className="col">
                <label className="fw-bold fs-6 mb-2">
                  {config.block_label}
                </label>
                <Stars
                  {...formik.getFieldProps("block")}
                  width={50}
                  name="block"
                />
              </div>
            </div>
          )}

          {config.environment_label && (
            <div className="mb-7">
              <div className="fw-bold fs-6 mb-2">
                {config.environment_label}
              </div>
              <div className="d-flex flex-wrap justify-content-start">
                {environmentIsEmpty ? (
                  <div className="w-100 text-center bg-secondary p-2 rounded-2">
                    目前沒有資料
                  </div>
                ) : (
                  environment.map((item) => (
                    <label
                      key={item.id}
                      className="me-2 mb-2 tags-label cursor-pointer"
                    >
                      <input
                        {...formik.getFieldProps("environment")}
                        defaultChecked={formik.values["environment"].includes(
                          `${item.id}`
                        )}
                        type="checkbox"
                        name="environment"
                        value={item.id}
                        hidden
                      />
                      <div className="fs-4 py-2 px-5 border border-2 rounded-2">
                        {item.name}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {config.description_label && (
            <div className="mb-7">
              <label className="fw-bold fs-6 mb-2">
                {config.description_label}
              </label>
              <div>
                <textarea
                  className="w-100 border border-1 border-gray-400 rounded-2 px-4 py-2 fs-3"
                  style={{ minHeight: "120px" }}
                  {...formik.getFieldProps("description")}
                ></textarea>
              </div>
            </div>
          )}

          {config.members_label && (
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">
                {config.members_label}
              </label>

              <div className="p-4 border border-gray-400 rounded-2">
                {!employeeIsEmpty &&
                  employee.map((em) => (
                    <FormCheck
                      key={em.id}
                      className="position-relative mb-2"
                      {...formik.getFieldProps("employee")}
                      id={`employee_${em.id}`}
                      name="employee"
                      value={em.id}
                      label={
                        <div className="position-absolute ps-10 top-0 start-0 w-100 d-block text-dark">
                          {em.name}
                        </div>
                      }
                    />
                  ))}
              </div>
            </div>
          )}

          {config.permission_label && (
            <div className="mb-6 row gy-0">
              <p className="fw-bold fs-6 mb-3">{config.permission_label}</p>
              {!permissionIsEmpty &&
                permission.map((item) => {
                  const isParent = item.childs && item.childs.length > 0;
                  return (
                    <div key={item.id} className="col-auto">
                      <FormCheck
                        className="mb-2"
                        label={<span className="text-dark">{item.name}</span>}
                        id={item.code}
                        name={`permission_${item.id}`}
                        inline
                        defaultChecked={
                          formik.values["permission"]?.[`${item.id}`]
                        }
                        onInput={(e) => {
                          document
                            .querySelectorAll(`[data-belong=${item.code}]`)
                            .forEach(
                              (input) => (input.checked = e.target.checked)
                            );

                          const getId = (dict, per) => {
                            dict.push(`${per.id}`);
                            Array.isArray(per.childs) &&
                              per.childs.reduce(getId, dict);
                            return dict;
                          };

                          const childIds = item.childs.reduce(getId, []);

                          const newPermi = formik.values["permission"];
                          Object.keys(newPermi).forEach(
                            (perId) =>
                              childIds.includes(perId) &&
                              (newPermi[`${perId}`] = e.target.checked)
                          );

                          newPermi[`${item.id}`] = e.target.checked;
                          formik.setFieldValue("permission", newPermi);
                        }}
                      />
                      {isParent && (
                        <div className="d-flex pt-2">
                          {item.childs.map((child) => {
                            const hasGrandChild =
                              child.childs && child.childs.length > 0;
                            return (
                              <div key={child.id}>
                                <FormCheck
                                  data-belong={item.code}
                                  data-group-head={`group-${child.id}`}
                                  label={
                                    <span className="text-dark">
                                      {child.name}
                                    </span>
                                  }
                                  id={`${child.code}_${child.id}`}
                                  name={`permission_${child.id}`}
                                  defaultChecked={
                                    formik.values["permission"]?.[`${child.id}`]
                                  }
                                  inline
                                  onInput={(e) => {
                                    const isChecked = e.target.checked;
                                    document
                                      .querySelectorAll(
                                        `[data-group=group-${child.id}]`
                                      )
                                      .forEach(
                                        (input) => (input.checked = isChecked)
                                      );

                                    const parentCheck = document.getElementById(
                                      item.code
                                    );
                                    if (!parentCheck) return;

                                    const newPermi =
                                      formik.values["permission"];

                                    if (
                                      isChecked &&
                                      ![
                                        ...document.querySelectorAll(
                                          `[data-group-head]`
                                        ),
                                      ]
                                        .map((input) => input.checked)
                                        .includes(false)
                                    ) {
                                      parentCheck.checked = true;
                                      newPermi[`${item.id}`] = isChecked;
                                    }

                                    if (!isChecked && parentCheck.checked) {
                                      parentCheck.checked = false;
                                      newPermi[`${item.id}`] = isChecked;
                                    }

                                    const getId = (dict, per) => {
                                      dict.push(`${per.id}`);
                                      Array.isArray(per.childs) &&
                                        per.childs.reduce(getId, dict);
                                      return dict;
                                    };
                                    const childIds = child.childs.reduce(
                                      getId,
                                      []
                                    );

                                    Object.keys(newPermi).forEach(
                                      (perId) =>
                                        childIds.includes(perId) &&
                                        (newPermi[`${perId}`] = isChecked)
                                    );

                                    newPermi[`${child.id}`] = isChecked;
                                    formik.setFieldValue(
                                      "permission",
                                      newPermi
                                    );
                                  }}
                                />
                                {hasGrandChild && (
                                  <div className="pt-2 ps-9">
                                    {child.childs.map((grand) => (
                                      <FormCheck
                                        key={grand.id}
                                        data-belong={item.code}
                                        data-group={`group-${child.id}`}
                                        label={grand.name}
                                        id={`${grand.code}_${grand.id}`}
                                        name={`permission_${grand.id}`}
                                        inline
                                        defaultChecked={
                                          formik.values["permission"]?.[
                                            `${grand.id}`
                                          ]
                                        }
                                        onInput={(e) => {
                                          const isChecked = e.target.checked;
                                          const grandParentCheck =
                                            document.getElementById(item.code);
                                          const groupHead =
                                            document.querySelector(
                                              `[data-group-head=group-${child.id}]`
                                            );
                                          if (!groupHead) return;

                                          const newPermi =
                                            formik.values["permission"];
                                          if (
                                            isChecked &&
                                            ![
                                              ...document.querySelectorAll(
                                                `[data-group=group${
                                                  grand.code === "modify"
                                                    ? ""
                                                    : `-${child.id}`
                                                }]`
                                              ),
                                            ]
                                              .map((input) => input.checked)
                                              .includes(false)
                                          ) {
                                            groupHead.click();
                                            newPermi[`${child.id}`] = isChecked;
                                          }

                                          if (!isChecked) {
                                            groupHead.checked =
                                              grandParentCheck.checked =
                                              newPermi[`${item.id}`] =
                                              newPermi[`${child.id}`] =
                                                isChecked;

                                            document.querySelectorAll(
                                              `[data-group-head=group-${child.id}]`
                                            ).checked = false;

                                            grand.code === "view" && [
                                              ...document.querySelectorAll(
                                                `[data-group=group-${child.id}]`
                                              ),
                                            ].forEach(
                                              (el) =>
                                                (el.checked = newPermi[
                                                  el.id.split("_")[1]
                                                ] = false)
                                            );
                                          }

                                          newPermi[`${grand.id}`] = isChecked;
                                          formik.setFieldValue(
                                            "permission",
                                            newPermi
                                          );
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {config.comment_label && (
            <div className="mb-7">
              <label className="fw-bold fs-6 mb-2">
                {config.comment_label}
              </label>
              <div>
                <textarea
                  className="w-100 border border-1 border-gray-400 rounded-2 px-4 py-2 fs-3"
                  style={{ minHeight: "120px" }}
                  {...formik.getFieldProps("comment")}
                  name="comment"
                ></textarea>
              </div>
            </div>
          )}
        </div>
        {/* end::Scroll */}

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
              !formik.touched ||
              !imagesValid
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
      {/*(formik.isSubmitting || isUserLoading) && <UsersListLoading />*/}
    </>
  );
};

export { EditModalForm };
