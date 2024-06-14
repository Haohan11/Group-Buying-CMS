import dynamic from "next/dynamic";
import currentTable from "@/data-list/globalVariable/currentTable";

const DynamicList = dynamic(
  async () => {
    const List = await import("@/data-list/List");
    return List;
  },
  {
    ssr: false,
  }
);

const AccountsPage = ({ tableName }) => {
  currentTable.set(tableName);

  return <DynamicList />;
};

export default AccountsPage;

export const getStaticPaths = async () => {
  const pageNameDict = [
    "info",
    "role",
  ];

  const paths = pageNameDict.map((pageName) => ({ params: { pageName } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { pageName } }) => {
  const tableNameDict = {
    info: "account",
    role: "role",
  };
  return {
    props: {
      tableName: tableNameDict[pageName],
    },
  };
};