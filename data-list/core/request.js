import currentTable from "../globalVariable/currentTable";
import dict from "../dictionary/tableDictionary";

const { fetchUrl } = dict;
const BASEURL = process.env.NEXT_PUBLIC_BACKENDURL;
const getTableUrl = () => fetchUrl[currentTable.get()];

export const alterSyncTables = async () => {
  const URL = `${BASEURL}/alter-tables`;
  try {
    const res = await fetch(URL);
    if (!res.ok) return false;
    return await res.json();
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getDataRequest = async (
  token,
  { page, size, keyword, sort, item, isEnable }
) => {
  const URL = `${BASEURL}/${getTableUrl()}?page=${page}&size=${size}&keyword=${keyword}&sort=${sort}&item=${item}${
    isEnable === undefined || isEnable === ""
      ? ""
      : isEnable === "1"
      ? "&onlyEnable="
      : "&onlyDisable="
  }`;
  try {
    const res = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return false;
    const {
      data: { total, totalPages, list },
    } = await res.json();
    return { total, totalPages, data: list };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getDataByTable = async (token, tableName) => {
  const tableUrl = fetchUrl[tableName];
  if (tableUrl === undefined)
    throw Error(`Table: ${tableName} or table fetchUrl doesn't exist.`);

  const URL = `${BASEURL}/${tableUrl}?${tableName !== "environment" && "onlyEnable="}`;

  try {
    const res = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return false;
    const {
      data: { total, totalPages, list },
    } = await res.json();
    return { total, totalPages, data: list };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createDataRequest = async (token, values) => {
  const URL = `${BASEURL}/${getTableUrl()}`;

  const formData = new FormData();
  for (const key in values) {
    const value = values[key];

    try {
      if (!Array.isArray(value)) {
        formData.append(
          key,
          (typeof value === "object" && value !== null && !(value instanceof File))
            ? JSON.stringify(value)
            : value
        );
        continue;
      }
    } catch (error) {
      return !!console.warn(error);
    }

    value.forEach((item) => {
      formData.append(key, item);
    });
  }

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await res.json();
    console.log("submited:", result);
    if (!res.ok) return false;
    return result.status;
  } catch (error) {
    console.log("error:", error);
    return false;
  }
};

export const updateDataRequest = async (token, values) => {
  const URL = `${BASEURL}/${getTableUrl()}`;

  const formData = new FormData();
  for (const key in values) {
    const value = values[key];
    if (!Array.isArray(value)) {
      formData.append(
        key,
        (typeof value === "object" && value !== null && !(value instanceof File))
          ? JSON.stringify(value)
          : value
      );
      continue;
    }

    value.forEach((item) => {
      formData.append(
        key,
        typeof item === "object" && !(item instanceof File)
          ? JSON.stringify(item)
          : item
      );
    });
  }

  try {
    const res = await fetch(URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await res.json();
    return { status: res.ok, message: result.message };
  } catch (error) {
    console.log("error:", error);
    return false;
  }
};

export const getAllTables = async (token) => {
  const URL = `${BASEURL}/all-tables`;
  try {
    const res = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return false;
    const { data } = await res.json();
    if(!data) return false;
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
}