import { useState, useContext, createContext } from "react";

const TableDataContext = createContext([]);

export const TableDataProvider = ({ children }) => {
  const [tableData, setTableData] = useState([]);

  return (
    <TableDataContext.Provider value={{ tableData, setTableData }}>
      {children}
    </TableDataContext.Provider>
  );
};

export const useTableData = () => useContext(TableDataContext)