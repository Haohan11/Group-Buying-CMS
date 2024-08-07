import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Row, Col } from "react-bootstrap";
import { useDebounce } from "@/_metronic/helpers";

import { regularReadData } from "@/data-list/core/request";
import { checkArray, transImageUrl } from "@/tool/helper";

import { getInput } from "./input";
import { hoistFormik } from "../globalVariable";

const stockDataCache = new Map();

const SaleStockList = (props) => {
  if (!hoistFormik.get())
    return <>{console.warn("`SaleStockList`: Missing formik.")}</>;

  if (hoistFormik.get().values?._separate) return <></>;

  const { data } = useSession();
  const token = data?.user?.accessToken;

  const [stockData, setStockData] = useState([]);
  const [keyword, setKeyword] = useState("");

  const debouncedKeyword = useDebounce(keyword, 200);

  useEffect(() => {
    if (debouncedKeyword === undefined || !token) return;

    const fetchUrl = `stock-backend?page=1&size=5${
      keyword === "" ? "" : `&keyword=${keyword}`
    }`;
    (async () => {
      if (stockDataCache.has(keyword)) {
        setStockData(stockDataCache.get(keyword));
        return;
      }

      const res = await regularReadData(token, fetchUrl);
      if (!res?.data) return;
      const rawData = res.data.map((data) => ({
        ...data,
        unit_price: data.price,
        qty: 1,
        cover_image: transImageUrl(data.cover_image),
      }));

      stockDataCache.set(keyword, rawData);
      setStockData(rawData);
    })();
  }, [debouncedKeyword]);

  useEffect(() => stockDataCache.clear.bind(stockDataCache), []);

  return (
    <div className="border-bottom border-2 border-secondary pt-4 pb-7 mb-2">
      <Row className="mb-5">
        <Col
          sm={6}
          className="d-flex align-items-center justify-content-between"
        >
          {getInput("text")({
            label: "搜尋商品 : ",
            labelclassname: "min-w-80px mt-2",
            placeholder: "輸入關鍵字",
            value: keyword,
            onChange: ({ target: { value } }) => setKeyword(value),
          })}
        </Col>
      </Row>
      <div className="d-flex overflow-x-auto bg-gray-200 p-8 rounded-2 min-h-150px">
        {checkArray(stockData) ? (
          stockData.map((stock) => (
            <div
              key={stock.id}
              className="d-flex bg-gray-100 p-2 pe-4 me-6 cursor-pointer shadow-sm rounded-4"
              onClick={() => {
                if (!props.storeTarget) return;
                const prev = hoistFormik.get().values[props.storeTarget];

                /** check if the stock is already in the list */
                if (
                  checkArray(prev[0]?.stockList) &&
                  prev[0].stockList.findIndex(
                    (stockItem) => stockItem.id === stock.id
                  ) !== -1
                )
                  return;

                hoistFormik.get().setFieldValue(
                  props.storeTarget,
                  prev.map((item) => ({
                    ...item,
                    stockList: checkArray(item.stockList)
                      ? [...item.stockList, stock]
                      : [stock],
                  }))
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
          <div className="w-100 text-center align-content-center text-gray-500">
            目前沒有商品資料
          </div>
        )}
      </div>
    </div>
  );
};

export default SaleStockList;
