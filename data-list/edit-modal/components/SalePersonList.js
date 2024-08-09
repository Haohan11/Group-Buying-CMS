import { useState, useContext, useRef, Fragment } from "react";
import {
  Row,
  Col,
  Accordion,
  AccordionContext,
  useAccordionButton,
} from "react-bootstrap";

import clsx from "clsx";
import Image from "next/image";

import { getInput, NumberInput, InteractNumber } from "./input";

import { checkArray, transImageUrl } from "@/tool/helper";
import { hoistFormik } from "../globalVariable";

const getFetchReceiverUrl = (keyword) => {
  if (
    !process.env.NEXT_PUBLIC_BACKENDURL ||
    !hoistFormik.get()?.values?.["member_id"] ||
    !keyword
  )
    return !!console.warn(
      "`SalePersonList`: Failed to get fetch receiver url."
    );

  return `${process.env.NEXT_PUBLIC_BACKENDURL}/receiver/${
    hoistFormik.get().values["member_id"]
  }?keyword=${keyword}`;
};

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
  { col: 5, colName: "收件人地址", key: "address", inputType: "address" },
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
  label: (
    <span className="text-danger">
      <span className="fs-5 bi bi-check2-square me-2"></span>
      設定主收件人
    </span>
  ),
  value: mainReceiverKey,
};

const removeReceiverKey = "_remove_receiver";
const removeReceiverOption = {
  label: (
    <span className="text-black">
      <span
        className="fs-5 bi bi-person-dash-fill
 me-2"
      ></span>
      移除此收件人
    </span>
  ),
  value: removeReceiverKey,
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
  if (!hoistFormik.get())
    return <>{console.warn("`SalePersonList`: Lose formik.")}</>;

  const personList = hoistFormik.get().values?.[props.name];
  const isSeparate = hoistFormik.get().values?._separate;

  /** `totalField` will mock as a person data append to `personList`,
   *  and use `totalFieldKey` for identification.
   *  Check personList render logic below */
  const totalFieldRef = useRef(null);
  const totalFieldKey = "_all";
  const totalField = (() => {
    const tRef = totalFieldRef;
    if (!isSeparate) return (tRef.current = null);

    if (tRef.current) return tRef.current;

    /** Only hold for prevent exception,
     *  personList should alway not empty in normal flow. */
    if (!checkArray(personList)) return { id: totalFieldKey, stockList: [] };

    const {
      id: deprecated,
      stockList,
      ...personProps
    } = personList.find((person) => person.main_reciever) ?? personList[0];

    return (tRef.current = {
      id: totalFieldKey,
      stockList,
      ...personProps,
      ...(checkArray(stockList) &&
        (() => {
          const totalMap = stockList.reduce(
            (keeper, stock) => keeper.set(stock.id, +stock.qty),
            new Map()
          );
          return {
            _qtyLimit: totalMap,
            _qtyKeeper: new Map(totalMap),
          };
        })()),
      set_qtyKeeper({ id, delta }) {
        if (!this?._qtyKeeper)
          return console.warn("`set_qtyKeeper`: Missing _qtyKeeper.");

        this._qtyKeeper.set(id, this._qtyKeeper.get(id) + +delta);
      },
      _qtyValid(id) {
        return (
          !this?._qtyKeeper || this._qtyKeeper.get(id) <= this._qtyLimit.get(id)
        );
      },
    });
  })();

  /** For person name keyword debounce */
  const newReceiverRef = useRef([]);
  const timeoutRef = useRef(null);

  const [receiverList, setReceiverList] = useState([]);
  setSingleStock.init(props.name);
  setSinglePerson.init(props.name);

  /* options and persons unique id */
  const [oidRef, pidRef] = [(id) => `_new${id}`, (id) => `_${id}`].map(
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
      {checkArray(personList) &&
        (isSeparate ? [...personList, totalField] : personList).map(
          (person) => {
            const isTotalField = person.id === totalFieldKey;
            return (
              <Accordion key={person.id}>
                {!isTotalField && (
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
                            "bg-light-danger": person.main_reciever,
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
                            placeholder: "搜尋 / 新增",
                            inputclassname: clsx(
                              "w-100 border",
                              person[key] ? "border-success" : "border-danger"
                            ),
                            creatable: true,
                            options: [
                              ...(person[key] && !person.main_reciever
                                ? [mainReceiverOption]
                                : []),
                              ...receiverList,
                              ...(person.main_reciever
                                ? []
                                : [removeReceiverOption]),
                            ],
                            value: person[key]
                              ? { label: person[key], value: person.id }
                              : null,
                            formatCreateLabel: (inputString) =>
                              `新增 \u00a0${inputString}\u00a0 收件人`,
                            onInputChange: (keyword) => {
                              if (timeoutRef.current)
                                clearTimeout(timeoutRef.current);
                              if (!keyword)
                                return setReceiverList(newReceiverRef.current);

                              timeoutRef.current = setTimeout(async () => {
                                try {
                                  const url = getFetchReceiverUrl(keyword);
                                  if (!url) return;

                                  const res = await fetch(url);
                                  const { data: rawData } = await res.json();
                                  const data = rawData.map((data) => ({
                                    label: data.name,
                                    value: data.id,
                                    personData: data,
                                  }));
                                  const newReceiver =
                                    newReceiverRef.current.filter(({ label }) =>
                                      label.includes(keyword)
                                    );
                                  setReceiverList([...newReceiver, ...data]);
                                } catch (error) {
                                  console.warn(error);
                                }
                              }, 300);
                            },
                            onCreateOption: (inputString) => {
                              const newId = oidRef.current.id;
                              const newPerson = {
                                label: inputString,
                                value: newId,
                              };
                              newReceiverRef.current.unshift(newPerson);

                              setSinglePerson({
                                personId: person.id,
                                data: {
                                  [key]: inputString,
                                  id: newId,
                                },
                              });
                            },
                            onChange: (option) => {
                              const prevList =
                                hoistFormik.get().values[props.name];

                              if (option.value === mainReceiverKey) {
                                return hoistFormik.get().setFieldValue(
                                  props.name,
                                  prevList.map((prevItem) => ({
                                    ...prevItem,
                                    main_reciever: prevItem.id === person.id,
                                  }))
                                );
                              }

                              if (option.value === removeReceiverKey) {
                                return hoistFormik.get().setFieldValue(
                                  props.name,
                                  prevList.filter(
                                    (prevItem) => prevItem.id !== person.id
                                  )
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
                                    phone: option.personData?.phone ?? "",
                                    address:
                                      option.personData?.contact_address ?? "",
                                  },
                                });
                            },
                          }),
                          phone: (
                            <NumberInput
                              defaultValue={person[key]}
                              inputclassname={clsx(
                                /^[0-9]{8,10}$/.test(person[key])
                                  ? "is-valid border border-success"
                                  : "is-invalid border border-danger"
                              )}
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
                          address: getInput("text")({
                            defaultValue: person[key],
                            inputclassname: clsx(
                              person[key]
                                ? "border border-success is-valid"
                                : "border border-danger is-invalid"
                            ),
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
                                    (total, stock) =>
                                      total + stock.price * stock.qty,
                                    0
                                  )
                                : 0}
                            </div>
                          ),
                        }[inputType] ?? <div>{person[key]}</div>}
                      </Col>
                    ))}
                  </Row>
                )}
                <Accordion.Collapse>
                  <>
                    {isSeparate && isTotalField && (
                      <div
                        className="mt-3 py-4 bg-gray-200 rounded-1 flex-center cursor-pointer bg-hover-gray-300"
                        onClick={() => {
                          const formik = hoistFormik.get();

                          if (
                            !formik ||
                            !formik.values?.[props.name] ||
                            !formik.values?.[props.name]?.[0]?.stockList?.length
                          )
                            return;

                          const prev = formik.values[props.name];
                          const stockList = formik.values[
                            props.name
                          ][0].stockList.map((stock) => ({ ...stock, qty: 0 }));

                          formik.setFieldValue(props.name, [
                            ...prev,
                            {
                              id: pidRef.current.id,
                              stockList: [...stockList],
                            },
                          ]);
                        }}
                      >
                        <span className="fs-1 text-gray-500 bi bi-plus-square-fill me-3"></span>
                        點擊新增收件人
                      </div>
                    )}
                    {isTotalField && (
                      <>
                        <div className="mt-5 border-2 border-top border-dashed"></div>
                        <div
                          className={clsx(
                            "mt-5 py-3 text-white text-center border bg-gray-500 ls-5",
                            borderColor
                          )}
                          style={{ marginRight: "1px" }}
                        >
                          商品總覽
                        </div>
                      </>
                    )}
                    <Row className="g-0">
                      {stockColDict.map(({ colName, col }, st_index) => (
                        <Col
                          sm={col}
                          key={st_index}
                          className={clsx("border border-top-0", borderColor, {
                            "border-start-0": st_index !== 0,
                          })}
                        >
                          <div
                            className={clsx(
                              "text-white text-center p-2",
                              isTotalField ? "bg-warning" : "bg-primary"
                            )}
                          >
                            {colName}
                          </div>
                        </Col>
                      ))}
                    </Row>
                    {checkArray(person.stockList) ? (
                      person.stockList.map((stock) => (
                        <Row
                          className={clsx(
                            "g-0",
                            isTotalField
                              ? "bg-light-warning"
                              : "bg-light-primary"
                          )}
                          key={stock.id}
                        >
                          {stockColDict.map(
                            ({ key, col, inputType }, s_index) => (
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
                                        src={transImageUrl(stock[key])}
                                        alt={"stock cover image"}
                                      />
                                    </div>
                                  ),
                                  price: (
                                    <div className="w-100 py-2 px-1">
                                      {isTotalField ? (
                                        getInput("plain")({
                                          value: stock["price"],
                                          inputclassname: "text-center",
                                        })
                                      ) : (
                                        <InteractNumber
                                          inputclassname="text-end"
                                          readonly={isSeparate}
                                          value={stock["price"]}
                                          onChange={({ target: { value } }) => {
                                            setSingleStock({
                                              personId: person.id,
                                              stockId: stock.id,
                                              data: {
                                                price: value,
                                              },
                                            });
                                          }}
                                        />
                                      )}
                                    </div>
                                  ),
                                  qty: (
                                    <div className="w-100 py-2 px-1">
                                      {isTotalField ? (
                                        getInput("plain")({
                                          value:
                                            totalFieldRef.current?._qtyKeeper?.get(
                                              stock.id
                                            ),
                                          inputclassname: "text-center",
                                        })
                                      ) : (
                                        <InteractNumber
                                          inputclassname={clsx(
                                            "text-end",
                                            false &&
                                              isSeparate &&
                                              (totalFieldRef.current?._qtyValid(
                                                stock.id
                                              )
                                                ? "border-success"
                                                : "border-danger")
                                          )}
                                          value={stock["qty"] ?? 0}
                                          onChange={({ target: { value } }) => {
                                            totalFieldRef.current?.set_qtyKeeper?.(
                                              {
                                                id: stock.id,
                                                delta: +value - +stock["qty"],
                                              }
                                            );

                                            setSingleStock({
                                              personId: person.id,
                                              stockId: stock.id,
                                              data: {
                                                qty: value,
                                              },
                                            });
                                          }}
                                        />
                                      )}
                                    </div>
                                  ),
                                  remove: (
                                    <div className="p-2 w-100 d-flex flex-wrap align-items-center justify-content-around">
                                      {!isTotalField && (
                                        <span
                                          className="cursor-pointer text-gray-700 fs-2 bi bi-x-circle-fill mx-1"
                                          onClick={() => {
                                            isSeparate
                                              ? (() => {
                                                  totalFieldRef.current?.set_qtyKeeper?.(
                                                    {
                                                      id: stock.id,
                                                      delta: -1 * +stock["qty"],
                                                    }
                                                  );

                                                  setSingleStock({
                                                    personId: person.id,
                                                    stockId: stock.id,
                                                    data: {
                                                      qty: 0,
                                                    },
                                                  });
                                                })()
                                              : setSinglePerson({
                                                  personId: person.id,
                                                  data: (prevPerson) => ({
                                                    ...prevPerson,
                                                    stockList:
                                                      prevPerson.stockList.filter(
                                                        (prevStock) =>
                                                          prevStock.id !==
                                                          stock.id
                                                      ),
                                                  }),
                                                });
                                          }}
                                        ></span>
                                      )}
                                      <span className="mx-1 mw-100 text-nowrap overflow-hidden text-overflow-ellipsis">
                                        {stock[key]}
                                      </span>
                                    </div>
                                  ),
                                  total: (
                                    <div className="p-2">
                                      {stock.price *
                                        (isTotalField
                                          ? totalFieldRef.current?._qtyKeeper?.get(
                                              stock.id
                                            )
                                          : stock.qty)}
                                    </div>
                                  ),
                                }[inputType] ?? (
                                  <div className="p-2">{stock[key]}</div>
                                )}
                              </Col>
                            )
                          )}
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
            );
          }
        )}
    </>
  );
};

export default SalePersonList;
