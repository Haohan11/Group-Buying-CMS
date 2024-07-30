import { useState, useEffect, useContext, useRef } from "react";
import {
  Row,
  Col,
  Accordion,
  AccordionContext,
  useAccordionButton,
} from "react-bootstrap";

import clsx from "clsx";
import Image from "next/image";

import { getInput, NumberInput } from "./input";

import { checkArray } from "@/tool/helper";
import { hoistFormik } from "../globalVariable";

const FoldButton = ({ eventKey }) => {
  const fold = useAccordionButton(eventKey, (event) => {
    event.preventDefault();
  });
  const { activeEventKey } = useContext(AccordionContext);

  const isMe = activeEventKey === eventKey;
  return (
    <span
      className={`fs-1 text-${isMe ? "danger" : "success"} bi bi-${
        isMe ? "dash" : "plus"
      }-circle-fill cursor-pointer`}
      onClick={fold}
    ></span>
  );
};

const borderColor = "border-gray-400";

const colDict = [
  { colName: "項次", key: "id", col: 1, inputType: "fold" },
  { colName: "收件人", key: "name", col: 2, inputType: "personName" },
  { colName: "收件人電話", key: "phone", col: 3, inputType: "phone" },
  { colName: "收件人地址", key: "address", col: 5, inputType: "text" },
  { colName: "小計", key: "price", col: 1 },
];

const stockColDict = [
  { colName: "項次", key: "id", col: 1, inputType: "remove" },
  { colName: "商品圖片", key: "cover_image", col: 2, inputType: "image" },
  { colName: "商品編號", key: "code", col: 2 },
  { colName: "商品名稱", key: "name", col: 2 },
  { colName: "規格", key: "specification", col: 1 },
  { colName: "單價", key: "price", col: 1 },
  { colName: "變價", col: 1, inputType: "price" },
  { colName: "數量", col: 1, inputType: "qty" },
  { colName: "小計", col: 1 },
];

const mainReceiverKey = "_set_main_reciever";
const mainReceiverOption = {
  label: "設定為主收件人",
  value: mainReceiverKey,
};

const SalePersonList = (props) => {
  const [receiverList, setReceiverList] = useState([]);

  /* options and persons unique id */
  const [oidRef, pidRef] = [(id) => `new_${id}`, (id) => `_${id}`].map(
    (adaptor) =>
      useRef({
        count: 0,
        get id() {
          const id = this.count++;
          return adaptor(id);
        },
      })
  );

  return (
    <>
      <Row className="g-0">
        {colDict.map(({ col, colName, key }, rt_index) => (
          <Col
            sm={col}
            key={key}
            className={clsx("border", borderColor, {
              "border-start-0": rt_index !== 0,
            })}
          >
            <div className="bg-gray-500 text-white text-center px-2 py-4">
              {colName}
            </div>
          </Col>
        ))}
      </Row>
      {checkArray(hoistFormik.get().values?.[props.name]) &&
        hoistFormik.get().values[props.name].map((item) => (
          <Accordion key={item.id}>
            <Row
              className={clsx(
                "g-0",
                item.main_reciever && "ribbon ribbon-end ribbon-clip"
              )}
              style={{
                boxShadow: item.main_reciever
                  ? "var(--bs-danger) 0px 0px 0px 2px"
                  : "none",
              }}
            >
              {item.main_reciever && (
                <div className="fs-8 bg-danger w-auto ribbon-label top-0 py-1">
                  主收件人
                  <span className="ribbon-inner"></span>
                </div>
              )}
              {colDict.map(({ key, col, inputType }, rc_index) => (
                <Col
                  sm={col}
                  key={key}
                  className={clsx(
                    "p-2 border border-top-0 flex-center",
                    borderColor,
                    {
                      "border-start-0": rc_index !== 0,
                    }
                  )}
                >
                  {{
                    text: getInput("text")({
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
                    }),
                    phone: (
                      <NumberInput
                        defaultValue={item[key]}
                        onChange={({ target: { value } }) => {
                          const prevList = hoistFormik.get().values[props.name];
                          hoistFormik.get().setFieldValue(
                            props.name,
                            prevList.map((prevItem) =>
                              prevItem.id === item.id
                                ? { ...prevItem, phone: value }
                                : prevItem
                            )
                          );
                        }}
                      />
                    ),
                    personName: getInput("select")({
                      inputclassname: "w-100",
                      placeholder: "輸入名稱",
                      creatable: true,
                      options: [
                        ...(item[key] ? [mainReceiverOption] : []),
                        ...receiverList,
                      ],
                      value: item[key]
                        ? { label: item[key], value: item.id }
                        : null,
                      formatCreateLabel: (inputString) =>
                        `新增 \u00a0${inputString}\u00a0 收件人`,
                      onCreateOption: (inputString) => {
                        const newId = oidRef.current.id;
                        const newPerson = {
                          label: inputString,
                          value: newId,
                        };
                        setReceiverList((prev) => [newPerson, ...prev]);

                        const prevList = hoistFormik.get().values[props.name];
                        hoistFormik.get().setFieldValue(
                          props.name,
                          prevList.map((prevItem) =>
                            prevItem.id === item.id
                              ? { ...prevItem, [key]: inputString, id: newId }
                              : prevItem
                          )
                        );
                      },
                      onChange: (option) => {
                        const prevList = hoistFormik.get().values[props.name];

                        if (option.value === mainReceiverKey) {
                          return hoistFormik.get().setFieldValue(
                            props.name,
                            prevList.map((prevItem) => ({
                              ...prevItem,
                              main_reciever: prevItem.id === item.id,
                            }))
                          );
                        }

                        const isDuplicated =
                          prevList.findIndex(
                            (target) => target.id === option.value
                          ) !== -1;

                        hoistFormik.get().setFieldValue(
                          props.name,
                          isDuplicated
                            ? prevList
                            : prevList.map((prevItem) =>
                                prevItem.id === item.id
                                  ? {
                                      ...prevItem,
                                      [key]: option.label,
                                      id: option.value,
                                    }
                                  : prevItem
                              )
                        );
                      },
                    }),
                    fold: (
                      <div className="w-100 d-flex justify-content-around align-items-center flex-wrap">
                        <div className="mx-1">
                          <FoldButton />
                        </div>
                        <span className="mx-1 mw-100 text-nowrap overflow-hidden text-overflow-ellipsis">
                          {item[key]}
                        </span>
                      </div>
                    ),
                  }[inputType] ?? <div className="">{item[key]}</div>}
                </Col>
              ))}
            </Row>
            <Accordion.Collapse>
              <>
                <Row className="g-0">
                  {stockColDict.map(({ colName, col }, st_index) => (
                    <Col
                      sm={col}
                      key={st_index}
                      className={clsx("border border-top-0", borderColor, {
                        "border-start-0": st_index !== 0,
                      })}
                    >
                      <div className="bg-primary text-white text-center p-2">
                        {colName}
                      </div>
                    </Col>
                  ))}
                </Row>
                {checkArray(item.stockList) ? (
                  item.stockList.map((stock) => (
                    <Row className="g-0 bg-light-primary" key={stock.id}>
                      {stockColDict.map(({ key, col, inputType }, s_index) => (
                        <Col
                          key={s_index}
                          sm={col}
                          className={clsx(
                            "border border-top-0 flex-center",
                            borderColor,
                            {
                              "border-start-0": s_index !== 0,
                            }
                          )}
                        >
                          {{
                            image: (
                              <div className="rounded-3 my-1 overflow-hidden">
                                <Image
                                  width={70}
                                  height={70}
                                  src={stock[key]}
                                  alt={"stock cover image"}
                                />
                              </div>
                            ),
                            price: (
                              <div className="py-2 px-1">
                                <NumberInput
                                  inputclassname="text-end"
                                  defaultValue={stock["price"]}
                                />
                              </div>
                            ),
                            qty: (
                              <div className="py-2 px-1">
                                <NumberInput
                                  inputclassname="text-end"
                                  defaultValue={stock["qty"] ?? 1}
                                />
                              </div>
                            ),
                            remove: (
                              <div className="p-2 w-100 d-flex flex-wrap align-items-center justify-content-around">
                                <span
                                  className="cursor-pointer text-gray-700 fs-2 bi bi-x-circle-fill mx-1"
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
                                              stockList:
                                                personRow.stockList.filter(
                                                  (s) => s.id !== stock.id
                                                ),
                                            }
                                      )
                                    );
                                  }}
                                ></span>
                                <span className="mx-1 mw-100 text-nowrap overflow-hidden text-overflow-ellipsis">
                                  {stock[key]}
                                </span>
                              </div>
                            ),
                          }[inputType] ?? (
                            <div className="p-2">{stock[key]}</div>
                          )}
                        </Col>
                      ))}
                    </Row>
                  ))
                ) : (
                  <div
                    className={clsx(
                      "p-4 text-center text-gray-500 border border-top-0",
                      borderColor
                    )}
                    style={{ marginRight: "1px" }}
                  >
                    沒有商品
                  </div>
                )}
              </>
            </Accordion.Collapse>
          </Accordion>
        ))}
      {hoistFormik.get().status?.separate && (
        <div
          className="mt-3 py-8 bg-gray-200 rounded-1 flex-center cursor-pointer"
          onClick={() => {
            const formik = hoistFormik.get();

            if (
              !formik ||
              !formik.values?.[props.name] ||
              !formik.values?.[props.name]?.[0]?.stockList?.length
            )
              return;

            const prev = formik.values[props.name];
            const stockList = formik.values[props.name][0].stockList.map(
              (stock) => ({ ...stock, qty: 0 })
            );

            formik.setFieldValue(props.name, [
              ...prev,
              { id: pidRef.current.id, stockList },
            ]);
          }}
        >
          <span className="fs-1 text-gray-500 bi bi-plus-square-fill me-3"></span>
          點擊新增收件人
        </div>
      )}
    </>
  );
};

export default SalePersonList;
