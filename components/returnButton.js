import ArrowLeft from "../public/icon/arrow-left.svg";
import Link from "next/link";
import exposeDiv from "@/components/exposeDiv";
import addClassName from "@/tool/addClassName";

const Div = addClassName(exposeDiv, "flex-center text-textgrey cursor-pointer");
const StyledLink = addClassName(Link, "flex-center text-textgrey");

const ReturnButton = ({ text, href, action, className }) => {
  return href ? (
    <StyledLink href={href} className={className}>
      <ArrowLeft width="2rem" height="2rem" className="me-2" />
      <span className="fs-5-sm">{text || "返回"}</span>
    </StyledLink>
  ) : (
    <Div className={className} onClick={action}>
      <ArrowLeft width="2rem" height="2rem" className="me-2" />
      <span className="fs-5-sm">{text || "返回"}</span>
    </Div>
  );
};

export default ReturnButton;
