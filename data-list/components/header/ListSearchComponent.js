/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { initialQueryState, KTIcon, useDebounce } from "@/_metronic/helpers";
import { useQueryRequest } from "../../core/QueryRequestProvider";
import currentTable from "@/data-list/globalVariable/currentTable";
import dict from "../../dictionary/tableDictionary";

const ListSearchComponent = () => {
  const router = useRouter();
  const { updateState } = useQueryRequest();
  const [searchTerm, setSearchTerm] = useState("");
  const tableName = currentTable.get();
  const { searchPlaceholder } = dict;
  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 150);
  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
        // updateState({ search: debouncedSearchTerm, ...initialQueryState })
          router.push({
            query: { ...router.query, keyword: debouncedSearchTerm,page:1 },
          });
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
    // More details about useDebounce: https://usehooks.com/useDebounce/
  );

  // useEffect(()=>{
  // setSearchTerm('')
  // },[router.asPath])

  return (
    <div className="card-title">
      {/* begin::Search */}
      <div className="d-flex align-items-center position-relative my-1">
        <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
        <input
          type="text"
          data-kt-user-table-filter="search"
          className="form-control form-control-solid w-250px ps-14"
          placeholder={`搜尋${searchPlaceholder[tableName] || ""}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
        />
      </div>
      {/* end::Search */}
    </div>
  );
};

export { ListSearchComponent };
