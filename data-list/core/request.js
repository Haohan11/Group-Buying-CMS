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

export const getAllData = async (token, fetchUrl) => {
  const URL = `${BASEURL}/${fetchUrl}`;

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

const CUDataRequest = (action) => {
  const actionDict = {
    create: {
      method: "POST",
      logMessage: "新增",
    },
    update: {
      method: "PUT",
      logMessage: "編輯",
    },
  }
  return async (token, values) => {
    const URL = `${BASEURL}/${getTableUrl()}`;
  
    const formData = new FormData();
    for (const key in values) {
      const value = values[key];
  
      try {
        if(value === null || value === undefined) continue;
        if (!Array.isArray(value)) {
          formData.append(
            key,
            (typeof value === "object" && !(value instanceof File))
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
        method: actionDict[action].method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await res.json();
      console.log(`${actionDict[action].logMessage}:`, result);
      if (!res.ok) return false;
      return result.status;
    } catch (error) {
      console.log(`${actionDict[action].logMessage} error:`, error);
      return false;
    }
  };
}

export const createDataRequest = CUDataRequest("create");

export const updateDataRequest = CUDataRequest("update");

export const deleteDataRequest = async (token, id) => {
  const URL = `${BASEURL}/${getTableUrl()}`;
  const formData = new FormData();
  formData.append("id", id);
  try {
    const res = await fetch(URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) return false;
    return true;
  } catch (error) {
    console.log(error);
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

export const getIndexItems = async () => {
  const URL = `${BASEURL}/get-index-item`;

  try {
    const res = await fetch(URL);
    if (!res.ok) return false;
    const { data } = await res.json();
    if(!data) return false;
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
}