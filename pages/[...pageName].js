import dynamic from "next/dynamic";
import currentTable from "@/data-list/globalVariable/currentTable";
import { getIndexItems } from "@/data-list/core/request";

const DynamicList = dynamic(
  async () => {
    const List = await import("@/data-list/List");
    return List;
  },
  {
    ssr: false,
  }
);

const TablePage = ({ tableName }) => {
  currentTable.set(tableName);
  return <DynamicList />;
};

export default TablePage;

export const getStaticPaths = async () => {
  const list = await getIndexItems();

  const paths = list.reduce(
    (pathArray, moduleItem) => [
      ...pathArray,
      ...moduleItem.indexItems.map((item) => ({
        params: {
          pageName: [moduleItem.route, item.route],
        },
      })),
    ],
    []
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { pageName } }) => {
  return {
    props: {
      tableName: pageName.join("-"),
    },
  };
};
