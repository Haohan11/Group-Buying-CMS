import { useState, useEffect, useContext, useId } from "react";
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
import { placeHolderColumns } from "@/data-list/table/columns/_columns";

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

const borderColor = "border-gray-300";

const colDict = [
  { colName: "項次", key: "id", col: 1, inputType: "fold" },
  { colName: "收件人", key: "name", col: 2, inputType: "personName" },
  { colName: "收件人電話", key: "phone", col: 3, inputType: "text" },
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

const SalePersonList = (props) => {
  const [personList, setPersonList] = useState([]);
  const [person, setPerson] = useState();
  const uid = useId();

  return (
    <>
      <Row className="g-0">
        {colDict.map(({ col, colName, key }, index) => (
          <Col
            sm={col}
            key={index}
            className={clsx("border", borderColor, {
              "border-start-0": index !== 0,
            })}
          >
            <div className="bg-gray-500 text-white text-center p-2">
              {colName}
            </div>
          </Col>
        ))}
      </Row>
      {checkArray(hoistFormik.get().values?.[props.name]) &&
        hoistFormik.get().values[props.name].map((item, index) => (
          <Accordion key={item.id ?? index} defaultActiveKey={0}>
            <Row className="g-0">
              {colDict.map(({ key, col, inputType }, index) => (
                <Col
                  sm={col}
                  key={key}
                  className={clsx(
                    "p-2 border border-top-0 flex-center",
                    borderColor,
                    {
                      "border-start-0": index !== 0,
                    }
                  )}
                >
                  {{
                    text: getInput("text")({
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
                    }),
                    personName: getInput("select")({
                      inputclassname: "w-100",
                      placeholder: "輸入名稱",
                      creatable: true,
                      options: personList,
                      value: person,
                      formatCreateLabel: (inputString) => `新增 \u00a0${inputString}\u00a0 收件人`,
                      onCreateOption: (inputString) => {
                        const newPerson = { label: inputString, value: `new_${uid}` }
                        setPersonList((prev) => [
                          ...prev,
                          newPerson,
                        ]);

                        setPerson(newPerson);
                      },
                      onChange: (option) => {
                        const prevList = hoistFormik.get().values[props.name];
                        hoistFormik.get().setFieldValue(
                          props.name,
                          prevList.map((prevItem) =>
                            prevItem.id === item.id
                              ? { ...prevItem, [key]: option.value }
                              : prevItem
                          )
                        );
                      },
                    }),
                    fold: (
                      <div className="w-100 d-flex justify-content-around align-items-center flex-wrap">
                        <FoldButton />
                        <span>{item[key] ?? index + 1}</span>
                      </div>
                    ),
                  }[inputType] ?? <div className="">{item[key]}</div>}
                </Col>
              ))}
            </Row>
            <Accordion.Collapse>
              <>
                <Row className="g-0">
                  {stockColDict.map(({ colName, col }, index) => (
                    <Col
                      sm={col}
                      key={index}
                      className={clsx("border border-top-0", borderColor, {
                        "border-start-0": index !== 0,
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
                      {stockColDict.map(({ key, col, inputType }, index) => (
                        <Col
                          key={index}
                          sm={col}
                          className={clsx(
                            "border border-top-0 flex-center",
                            borderColor,
                            {
                              "border-start-0": index !== 0,
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
                                  name={"_stop"}
                                  inputclassname="text-end"
                                  defaultValue={stock["price"]}
                                />
                              </div>
                            ),
                            qty: (
                              <div className="py-2 px-1">
                                <NumberInput
                                  name={"_stop"}
                                  inputclassname="text-end"
                                  defaultValue={1}
                                />
                              </div>
                            ),
                            remove: (
                              <div className="p-2 w-100">
                                <div className="w-100 d-flex flex-wrap align-items-center justify-content-around">
                                  <span
                                    className="cursor-pointer text-gray-700 fs-2 bi bi-x-circle-fill"
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
                                  <span>{stock[key]}</span>
                                </div>
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
                  >
                    沒有商品
                  </div>
                )}
              </>
            </Accordion.Collapse>
          </Accordion>
        ))}
    </>
  );
};

export default SalePersonList;
