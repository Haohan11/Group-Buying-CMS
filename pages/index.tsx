import Image from "next/image";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="h-100 flex-center flex-column">
      <div className="position-relative w-150px h-150px">
        <Image alt="logo" fill src="/logo.svg" />
      </div>
      <p className="fs-2 fw-bold text-primary mt-6">
        請由左側面板進入系統
      </p>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context)
  console.log("index session: ",session);
  if (!session) {
      return {
        redirect: { destination: "/login" },
      };
  }

  return {
    props: {
    },
  };
}