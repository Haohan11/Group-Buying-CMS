import { useState, useEffect } from "react";
import { useTable } from "react-table";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { useListView } from "../core/ListViewProvider";
import { TablePagination } from "../components/pagination/TablePagination";
import { useTableData } from "@/data-list/core/tableDataProvider";
import { useRouter } from "next/router";

import { placeHolderColumns } from "./columns/_columns";
import { useSession } from "next-auth/react";
import { getDataRequest } from "../core/request";

import currentTable from "../globalVariable/currentTable";
import dict from "../dictionary/tableDictionary";
import { usePermission } from "@/tool/hooks";

const { column } = dict;

const fetchTableData = async (
  token,
  { page = 1, size = 5, keyword = "", sort, item, isEnable }
) => await getDataRequest(token, { page, size, keyword, sort, item, isEnable });

const Table = ({ setTrigger }) => {
  const { data, status } = useSession();
  const token = data?.user?.accessToken;

  const router = useRouter();
  const { setItemIdForUpdate } = useListView();
  const closeModal = () => setItemIdForUpdate(undefined);

  const tableName = currentTable.get();
  const columns = column[tableName] || placeHolderColumns;
  
  const { tableData, setTableData } = useTableData();
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const permission = usePermission();
  
  useEffect(() => {
    if (!permission || !router) return;

    const index = columns.findIndex((col) => col.id === "actions");
    if (index === -1) return;

    router.asPath.includes("stock") &&
      !permission.stock?.modify &&
      columns.splice(index, 1);
    router.asPath.includes("environment") &&
      !permission.environment?.modify &&
      columns.splice(index, 1);
    router.asPath.includes("employee") &&
      !permission.account?.modify &&
      columns.splice(index, 1);

    // trigger table to rerender
    setTrigger(`${columns.length}_${tableName}`);
  }, [permission, router]);

  useEffect(() => {
    if (!router.isReady || !token) return;
    closeModal();

    const {
      query: { page, size, keyword, sort, item, isEnable },
    } = router;
    (async () => {
      setIsLoading(true);
      const result = await fetchTableData(token, {
        page,
        size,
        keyword,
        sort,
        item,
        isEnable,
      });
      setIsLoading(false);
      if (result === false) return;

      const { data, totalPages } = result;
      setTableData(data);
      setTotalPages(totalPages);
    })();
  }, [router, token]);

  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } =
    useTable({
      columns,
      data: tableData,
    });

  return (
    <div className="py-4">
      <div className="table-responsive mb-8">
        <table
          id="kt_table_users"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
          {...getTableProps()}
        >
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              {headers.map((column) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row, i) => {
                prepareRow(row);
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
              })
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className="d-flex text-center w-100 align-content-center justify-content-center">
                    <span className="">
                      {isLoading ? "載入中..." : "目前沒有資料"}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination totalPages={totalPages} />
    </div>
  );
};

export { Table };
