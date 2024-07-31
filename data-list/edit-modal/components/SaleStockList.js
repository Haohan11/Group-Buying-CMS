import { useState, useEffect } from "react";
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
  const { data } = useSession();
  const token = data?.user?.accessToken;

  const [stockData, setStockData] = useState([]);
  const [keyword, setKeyword] = useState("");

  const debouncedKeyword = useDebounce(keyword, 150);

  useEffect(() => {
    if (debouncedKeyword === undefined || !token) return;

    const fetchUrl = `stock?page=1&size=5${
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

  useEffect(() => () => stockDataCache.clear(), []);

  return (
    <div>
      <Row className="mb-4 g-6">
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
      <div className="mt-2 d-flex overflow-x-auto bg-gray-200 p-8 rounded-2">
        {checkArray(stockData) ? (
          stockData.map((stock) => (
            <div
              key={stock.id}
              className="d-flex bg-gray-100 p-2 pe-4 me-6 cursor-pointer shadow-sm rounded-4"
              onClick={() => {
                if (!props.storeTarget) return;
                const prev = hoistFormik.get().values[props.storeTarget];

                hoistFormik.get().setFieldValue(
                  props.storeTarget,
                  prev.map((item) => {
                    if (!checkArray(item.stockList))
                      return { ...item, stockList: [stock] };
                    return {
                      ...item,
                      ...(item.stockList.findIndex(
                        (stockItem) => stockItem.id === stock.id
                      ) === -1 && { stockList: [...item.stockList, stock] }),
                    };
                  })
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
          <div className="w-100 text-center text-gray-500 my-5">
            目前沒有商品資料
          </div>
        )}
      </div>
    </div>
  );
};

export default SaleStockList;
