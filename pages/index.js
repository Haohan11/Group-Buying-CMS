import Logo from "@/components/logo";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="h-100 flex-center flex-column">
      <Logo width="300" />
      <p className="fs-2 fw-bold text-primary mt-16">
        請由左側面板進入系統
      </p>
    </div>
  );
}

export const getServerSideProps = async (context) => {
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