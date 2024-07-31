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

const personDict = [
  { col: 1, colName: "項次", key: "id", inputType: "fold" },
  { col: 2, colName: "收件人", key: "name", inputType: "personName" },
  { col: 3, colName: "收件人電話", key: "phone", inputType: "phone" },
  { col: 5, colName: "收件人地址", key: "address", inputType: "text" },
  { col: 1, colName: "小計", key: "total", inputType: "total" },
];

const stockColDict = [
  { col: 1, colName: "項次", key: "id", inputType: "remove" },
  { col: 2, colName: "商品圖片", key: "cover_image", inputType: "image" },
  { col: 2, colName: "商品編號", key: "code" },
  { col: 2, colName: "商品名稱", key: "name" },
  { col: 1, colName: "規格", key: "specification" },
  { col: 1, colName: "單價", key: "unit_price" },
  { col: 1, colName: "變價", inputType: "price" },
  { col: 1, colName: "數量", inputType: "qty" },
  { col: 1, colName: "小計", key: "total", inputType: "total" },
];

const mainReceiverKey = "_set_main_reciever";
const mainReceiverOption = {
  label: "設定為主收件人",
  value: mainReceiverKey,
};

const setSingleStock = ({ personId, stockId, data }) => {
  const valueName = setSingleStock.valueName;
  if (!valueName || !hoistFormik.get())
    return console.warn("`setSingleStock`: Lose formik or valueName.");

  const prev = hoistFormik.get().values[valueName];
  if (!Array.isArray(prev)) return;

  hoistFormik.get().setFieldValue(
    valueName,
    prev.map((person) => {
      return person.id === personId
        ? {
            ...person,
            stockList: person.stockList.map((prevStock) =>
              prevStock.id === stockId
                ? {
                    ...prevStock,
                    ...data,
                  }
                : prevStock
            ),
          }
        : person;
    })
  );
};
setSingleStock.init = function (valueName) {
  this.valueName = valueName;
};

const setSinglePerson = ({ personId, data }) => {
  const valueName = setSinglePerson.valueName;
  if (!valueName || !hoistFormik.get())
    return console.warn("`setSinglePerson`: Lose formik or valueName.");

  const prevList = hoistFormik.get().values[valueName];
  if (!Array.isArray(prevList)) return;

  hoistFormik.get().setFieldValue(
    valueName,
    prevList.map((prevPerson) =>
      prevPerson.id === personId
        ? typeof data === "function"
          ? data(prevPerson)
          : { ...prevPerson, ...data }
        : prevPerson
    )
  );
};
setSinglePerson.init = function (valueName) {
  this.valueName = valueName;
};

const SalePersonList = (props) => {
  const [receiverList, setReceiverList] = useState([]);
  setSingleStock.init(props.name);
  setSinglePerson.init(props.name);

  const isSeparate = hoistFormik.get().status?.separate;

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
        {personDict.map(({ col, colName, key }, rt_index) => (
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
        hoistFormik.get().values[props.name].map((person) => (
          <Accordion key={person.id}>
            <Row
              className={clsx(
                "g-0",
                person.main_reciever && "ribbon ribbon-end ribbon-clip"
              )}
              style={{
                boxShadow: person.main_reciever
                  ? "var(--bs-danger) 0px 0px 0px 2px"
                  : "none",
              }}
            >
              {person.main_reciever && (
                <div className="fs-8 bg-danger w-auto ribbon-label top-0 py-1">
                  主收件人
                  <span className="ribbon-inner"></span>
                </div>
              )}
              {personDict.map(({ key, col, inputType }, rc_index) => (
                <Col
                  sm={col}
                  key={key}
                  className={clsx(
                    "p-2 border border-top-0 flex-center",
                    borderColor,
                    {
                      "border-start-0": rc_index !== 0,
                      "bg-light-danger": person.main_reciever
                    }
                  )}
                >
                  {{
                    fold: (
                      <div className="w-100 d-flex justify-content-around align-items-center flex-wrap">
                        <div className="mx-1">
                          <FoldButton />
                        </div>
                        <span className="mx-1 mw-100 text-nowrap overflow-hidden text-overflow-ellipsis">
                          {person[key]}
                        </span>
                      </div>
                    ),
                    personName: getInput("select")({
                      inputclassname: "w-100",
                      placeholder: "輸入名稱",
                      creatable: true,
                      options: [
                        ...(person[key] ? [mainReceiverOption] : []),
                        ...receiverList,
                      ],
                      value: person[key]
                        ? { label: person[key], value: person.id }
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

                        setSinglePerson({
                          personId: person.id,
                          data: {
                            [key]: inputString,
                            id: newId,
                          },
                        });
                      },
                      onChange: (option) => {
                        const prevList = hoistFormik.get().values[props.name];

                        if (option.value === mainReceiverKey) {
                          return hoistFormik.get().setFieldValue(
                            props.name,
                            prevList.map((prevItem) => ({
                              ...prevItem,
                              main_reciever: prevItem.id === person.id,
                            }))
                          );
                        }

                        const isDuplicated =
                          prevList.findIndex(
                            (target) => target.id === option.value
                          ) !== -1;

                        !isDuplicated &&
                          setSinglePerson({
                            personId: person.id,
                            data: {
                              [key]: option.label,
                              id: option.value,
                            },
                          });
                      },
                    }),
                    phone: (
                      <NumberInput
                        defaultValue={person[key]}
                        onChange={({ target: { value } }) => {
                          setSinglePerson({
                            personId: person.id,
                            data: {
                              [key]: value,
                            },
                          });
                        }}
                      />
                    ),
                    text: getInput("text")({
                      defaultValue: person[key],
                      onChange: ({ target: { value } }) => {
                        setSinglePerson({
                          personId: person.id,
                          data: {
                            [key]: value,
                          },
                        });
                      },
                    }),
                    total: (
                      <div>
                        {checkArray(person?.stockList)
                          ? person.stockList.reduce(
                              (total, stock) => total + stock.price * stock.qty,
                              0
                            )
                          : 0}
                      </div>
                    ),
                  }[inputType] ?? <div>{person[key]}</div>}
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
                {checkArray(person.stockList) ? (
                  person.stockList.map((stock) => (
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
                                  value={stock["price"]}
                                  onChange={({ target: { value } }) =>
                                    setSingleStock({
                                      personId: person.id,
                                      stockId: stock.id,
                                      data: {
                                        price: value,
                                      },
                                    })
                                  }
                                />
                              </div>
                            ),
                            qty: (
                              <div className="py-2 px-1">
                                <NumberInput
                                  inputclassname="text-end"
                                  value={stock["qty"] ?? 0}
                                  onChange={({ target: { value } }) =>
                                    setSingleStock({
                                      personId: person.id,
                                      stockId: stock.id,
                                      data: {
                                        qty: value,
                                      },
                                    })
                                  }
                                />
                              </div>
                            ),
                            remove: (
                              <div className="p-2 w-100 d-flex flex-wrap align-items-center justify-content-around">
                                <span
                                  className="cursor-pointer text-gray-700 fs-2 bi bi-x-circle-fill mx-1"
                                  onClick={() => {
                                    isSeparate
                                      ? setSingleStock({
                                          personId: person.id,
                                          stockId: stock.id,
                                          data: {
                                            qty: 0,
                                          },
                                        })
                                      : setSinglePerson({
                                          personId: person.id,
                                          data: (prevPerson) => ({
                                            ...prevPerson,
                                            stockList:
                                              prevPerson.stockList.filter(
                                                (prevStock) =>
                                                  prevStock.id !== stock.id
                                              ),
                                          }),
                                        });
                                  }}
                                ></span>
                                <span className="mx-1 mw-100 text-nowrap overflow-hidden text-overflow-ellipsis">
                                  {stock[key]}
                                </span>
                              </div>
                            ),
                            total: (
                              <div className="p-2">
                                {stock.price * stock.qty}
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
                      "p-6 text-center bg-light text-gray-500 border border-top-0",
                      borderColor
                    )}
                    style={{ marginRight: "1px" }}
                  >
                    尚未添加商品
                  </div>
                )}
              </>
            </Accordion.Collapse>
          </Accordion>
        ))}
      {isSeparate && (
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
