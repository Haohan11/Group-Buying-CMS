import { useState, useContext, createContext } from "react";

const TableDataContext = createContext([]);

export const TableDataProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [preLoadData, setPreLoadData] = useState({});

  return (
    <TableDataContext.Provider
      value={{
        tableData,
        setTableData,
        preLoadData,
        setPreLoadData,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </TableDataContext.Provider>
  );
};

export const useTableData = () => useContext(TableDataContext);
