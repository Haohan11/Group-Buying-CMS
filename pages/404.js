import Link from "next/link";
import Image from "next/image";


const Custom404 = () => {
  return (
    <div className="vh-100 flex-center flex-column fs-1">
      <div className="position-relative w-150px h-150px">
        <Image alt="logo" fill src="/logo.svg" />
      </div>
      <div className="flex-center my-8">
        <span className="text-primary">404</span>
        <span className="mx-5 fs-1 lh-1">|</span>
        <span>訪問的頁面不存在</span>
      </div>
      <Link href="/">
        <button className="btn btn-primary">返回首頁</button>
      </Link>
    </div>
  );
};

Custom404.getLayout = (page) => <>{page}</>;

export default Custom404;
