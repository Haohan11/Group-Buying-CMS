import { Row, Col } from "react-bootstrap";
import { InputLabel, NumberInput } from "./input";

import { hoistFormik, hoistPreLoadData } from "../globalVariable";

const PriceTable = (props) => {
  return (
    <div>
      <InputLabel required={props.required} text={props.label} />
      {hoistPreLoadData.get()?.[props.name]?.length > 0 ? (
        <Row className="g-0">
          {hoistPreLoadData
            .get()
            ?.[props.name].map(({ id, name, price }, index) => (
              <Col
                sm={3}
                key={id}
                className={`border border-gray-300 ${
                  index % 4 !== 0 && "border-start-0"
                }`}
              >
                <div
                  className="bg-gray-500 text-white text-center p-2"
                  style={{ letterSpacing: "1px" }}
                >
                  {name}
                </div>
                <div className="p-5">
                  <NumberInput
                    name={`${props.name}_${id}`}
                    defaultValue={
                      hoistFormik
                        .get()
                        .values[props.name]?.find(({ id: tid }) => tid === id)
                        ?.price || price
                    }
                    inputclassname={{
                      "is-invalid":
                        (hoistFormik.get().touched[`${props.name}_${id}`] ||
                          hoistFormik.get().touched[props.name]?.[index]?.id) &&
                        !/^[1-9][0-9]*$/.test(
                          hoistFormik
                            .get()
                            .values[props.name]?.find(
                              ({ id: tid }) => tid === id
                            )?.price
                        ),
                      "is-valid":
                        (hoistFormik.get().touched[`${props.name}_${id}`] ||
                          hoistFormik.get().touched[props.name]?.[index]?.id) &&
                        /^[1-9][0-9]*$/.test(
                          hoistFormik
                            .get()
                            .values[props.name].find(
                              ({ id: tid }) => tid === id
                            )?.price
                        ),
                    }}
                    onChange={(e) => {
                      hoistFormik.get().setFieldValue(
                        props.name,
                        hoistFormik
                          .get()
                          .values[props.name].filter(
                            ({ id: tid }) => tid !== id
                          )
                          .concat({
                            id,
                            price: e.target.value,
                          })
                      );
                    }}
                  />
                </div>
              </Col>
            ))}
        </Row>
      ) : (
        <div className="bg-gray-200 p-8 text-center text-gray-500 rounded-2">
          目前沒有資料
        </div>
      )}
      {hoistFormik.get().touched[props.name] &&
        (Object.values(hoistFormik.get().status?.[props.name] ?? {}).some(
          (price) => isNaN(parseInt(price))
        ) ||
          hoistFormik.get().errors[props.name]) && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{hoistFormik.get().errors[props.name]}</span>
            </div>
          </div>
        )}
    </div>
  );
};

export default PriceTable;
