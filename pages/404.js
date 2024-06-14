import Link from "next/link";
import Logo from "@/components/logo";

const Custom404 = () => {
  return (
    <div className="vh-100 flex-center flex-column fs-1">
      <Logo className="mb-8" width="300" />
      <div className="mb-16 text-primary fw-bold">
        <span className="pe-8 me-8" style={{ borderRight: "3px solid" }}>404</span>
        <span>此頁面不存在</span>
      </div>
      <Link href="/">
        <button className="btn btn-primary px-12">返回首頁</button>
      </Link>
    </div>
  );
};

Custom404.getLayout = (page) => <>{page}</>;

export default Custom404;
