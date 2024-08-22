import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";

import Image from "next/image";

import clsx from "clsx";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { Row, Col, FormCheck } from "react-bootstrap";

import { useDebounce } from "@/_metronic/helpers";

import {
  onlyInputNumbers,
  transImageUrl,
  checkArray,
  toArray,
} from "@/tool/helper";

import { regularReadData } from "@/data-list/core/request";

import { hoistFormik, hoistPreLoadData } from "../globalVariable";

export const InputLabel = ({ required, text, className, holder, ...props }) =>
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

export const ValidateInputField = ({
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
  isMulti = false,
  isDisabled,
  isClearable,
  disabled,
  holder,
  value,
  defaultValue,
  onClick,
  onChange,
  onKeyDown,
  onBlur,
  onInputChange, // select
  noOptionsMessage, // select
  formatCreateLabel, // creatable select
  options,
  creatable, // creatable select
  onCreateOption, // creatable select
}) => {
  return holder ? (
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
            {hoistFormik.get().values?.[name] ?? value ?? "沒有資料"}
          </p>
        ),
        select: (
          <>
            {options ||
            (formik.values?.[name] &&
              checkArray(hoistPreLoadData.get()?.[name])) ? (
              (() => {
                const SelectComp = creatable ? CreatableSelect : Select;
                return (
                  <SelectComp
                    {...{ name, isMulti, isDisabled, isClearable, value, onInputChange }}
                    {...(name && { inputId: `input_${name}` })}
                    className={clsx(
                      "react-select-styled react-select-solid rounded",
                      !inputclassname.includes("border") &&
                        "border border-gray-100",
                      inputclassname
                    )}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: "var(--bs-gray-200)",
                      },
                    })}
                    classNamePrefix="react-select"
                    placeholder={placeholder ?? "請選擇或輸入關鍵字"}
                    noOptionsMessage={
                      noOptionsMessage ?? (() => "目前沒有資料")
                    }
                    options={options ?? hoistPreLoadData.get()[name]}
                    {...(creatable && {
                      onCreateOption:
                        onCreateOption ??
                        ((inputString) => {
                          hoistPreLoadData.set([
                            ...hoistPreLoadData.get()[name],
                            {
                              label: inputString,
                              value: `new_${uidRef.current.id}`,
                            },
                          ]);
                        }),
                      formatCreateLabel:
                        formatCreateLabel ??
                        ((inputString) => `新增 ${inputString}`),
                    })}
                    defaultValue={
                      Array.isArray(options)
                        ? options.find(
                            (option) => option.value === formik.values[name]
                          ) || toArray(defaultValue)
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
                );
              })()
            ) : (
              <div
                onClick={() => name && formik.setFieldTouched(name, true)}
                className="form-select form-select-solid text-gray-500"
              >
                目前沒有資料
              </div>
            )}
          </>
        ),
        textarea: (
          <textarea
            {...(name && {
              ...formik.getFieldProps(name),
              id: `input_${name}`,
            })}
            className="border border-1 border-gray-200 form-control form-control-solid"
            style={{ minHeight: "120px" }}
          ></textarea>
        ),
      }[type] ??
        (["text", "password"].includes(type) && (
          <input
            value={value}
            {...(!readonly && name && formik.getFieldProps(name))}
            {...(name && { id: `input_${name}` })}
            {...{ placeholder, defaultValue, type }}
            className={clsx(
              "form-control form-control-solid mb-3 mb-lg-0",
              { "is-invalid": formik?.touched[name] && formik?.errors[name] },
              { "is-valid": formik?.touched[name] && !formik?.errors[name] },
              inputclassname
            )}
            autoComplete="off"
            {...(onlynumber && {
              onKeyDown: (event) => onlyInputNumbers(event),
            })}
            {...(typeof onChange === "function" && { onChange })}
            {...(typeof onBlur === "function" && { onBlur })}
            {...(typeof onKeyDown === "function" && { onKeyDown })}
            disabled={readonly || formik?.isSubmitting || disabled}
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
};

export const LabelHolder = () => InputLabel({ holder: true });
export const TextHolder = () => ValidateInputField({ holder: true });

export const CheckBoxInput = (props) =>
  ValidateInputField({ ...props, type: "checkbox" });

export const NumberInput = (props) =>
  ValidateInputField({ ...props, onlynumber: true });

export const InteractNumber = ({ max, min, onChange, ...props }) => {
  const ceil = max ?? Number.MAX_SAFE_INTEGER;
  const floor = min ?? 0;

  return ValidateInputField({
    ...props,
    onChange,
    onKeyDown: (event) => {
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        ({
          ArrowUp: () =>
            (event.target.value = Math.min(++event.target.value, ceil)),
          ArrowDown: () =>
            (event.target.value = Math.max(--event.target.value, floor)),
        })[event.key]();

        typeof onChange === "function" && onChange(event);

        return;
      }
      onlyInputNumbers(event);
    },
  });
};

export const MultiSelectInput = (props) =>
  ValidateInputField({ ...props, type: "select", isMulti: true });

export const SwitchInput = (props) => (
  <Row
    className={`cursor-pointer ${props.inline && "flex-column g-3"}`}
    as="label"
  >
    <Col>
      <span className="fw-bold fs-6">{props.label}</span>
    </Col>
    <Col sm={"auto"} className={`${!props.inline && "text-center"}`}>
      <FormCheck
        inline
        type="switch"
        defaultChecked={hoistFormik.get().getFieldProps(props.name).value}
        {...(props.name && {
          id: `switch_${props.name}`,
          ...hoistFormik.get().getFieldProps(props.name),
        })}
      />
    </Col>
  </Row>
);

export const ImageInput = (props) => {
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

export const MultiImageInput = (props) => {
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

export const Button = ({
  type = "button",
  text,
  className,
  variant = "primary",
  ...props
}) => (
  <button
    type={type}
    className={clsx("btn", className, `btn-${variant}`)}
    {...props}
  >
    {text}
  </button>
);

export const getInput = (type) => (props) =>
  ValidateInputField({ ...props, type });

export const generateInputs = (arr) =>
  arr.reduce(
    (dict, type) => ({
      ...dict,
      [type]: getInput(type),
    }),
    {}
  );

export const AjaxSelect = (() => {
  const Select = getInput("select");

  return ({ getFetchUrl, optionAdaptor, ...props }) => {
    if (typeof getFetchUrl !== "function")
      return (
        <>{console.error("AjaxSelect: `getFetchUrl` must be a function.")}</>
      );

    const { data } = useSession();
    const token = data?.user?.accessToken;

    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebounce(keyword, 200);

    const [options, setOptions] = useState([]);

    useEffect(() => {
      if (!token) return;
      const url = getFetchUrl(debouncedKeyword);
      (async () => {
        const res = await regularReadData(token, url);
        if (!res.data) {
          console.warn(`AjaxSelect[${props.name}]: Fail to fetch data.`);
          return;
        }

        setOptions(optionAdaptor(res.data));
      })();
    }, [token, debouncedKeyword]);

    return (
      <Select
        {...props}
        isClearable={true} 
        value={
          hoistFormik.get().values[props.name]
            ? {
                label: hoistFormik.get().values[props.label_name],
                value: hoistFormik.get().values[props.name],
              }
            : null
        }
        options={options}
        onInputChange={setKeyword}
        onChange={(item) =>
          hoistFormik
            .get()
            .setValues({
              ...hoistFormik.get().values,
              [props.name]: item?.value ?? "",
              [props.label_name]: item?.label ?? "",
            })
        }
      />
    );
  };
})();
