import dynamic from "next/dynamic";
import currentTable from "@/data-list/globalVariable/currentTable";

// const DynamicList = dynamic(
//   async () => {
//     const List = await import("@/data-list/List");
//     return List;
//   },
//   {
//     ssr: false,
//   }
// );

const MemberPage = ({ tableName }) => {
  // currentTable.set(tableName);

  return <h1>{tableName}</h1>
  // return <DynamicList />;
};

export default MemberPage;

export const getStaticPaths = async () => {
  const pageNameDict = [
    "management",
    "tag",
    "grade",
    "identity",
  ];

  const paths = pageNameDict.map((pageName) => ({ params: { pageName } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { pageName } }) => {
  const tableNameDict = {
    management: "member",
    tag: "member-tag",
    grade: "member-grade",
    identity: "member-identity",
  };
  return {
    props: {
      tableName: tableNameDict[pageName],
    },
  };
};