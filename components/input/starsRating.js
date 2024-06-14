import { Fragment } from "react";
import Star from "@/icon/star-outline";
import { FormLabel } from "react-bootstrap";
import exposeDiv from "@/components/exposeDiv";

import addClassName from "@/tool/addClassName";
const Div = addClassName(exposeDiv, "hstack rating flex-row-reverse justify-content-end align-items-center")

const Stars = ({name, width, value, ...props}) => {
  return (
    <Div {...props}>
      {[1, 2, 3, 4, 5].map((score) => (
        <Fragment key={score}>
          <input type="radio" id={`sr_${name}_${score}`} name={name} value={6 - score} defaultChecked={6 - value === score} hidden />
          <FormLabel htmlFor={`sr_${name}_${score}`} className={`d-inline-block lh-1 cursor-pointer m-0 ${score !== 1 && "pe-1"}`}>
            <Star width={width} />
          </FormLabel>
        </Fragment>
      ))}
    </Div>
  );
};

export default Stars;
