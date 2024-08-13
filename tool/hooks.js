import { useState, useEffect, useRef } from "react";

export function useModals() {
  const [modals, setModals] = useState({});

  const handleShowModal = (id) => {
    setModals((prevModals) => ({ ...prevModals, [id]: true }));
  };

  const handleCloseModal = (id) => {
    setModals((prevModals) => ({ ...prevModals, [id]: false }));
  };

  const isModalOpen = (id) => modals[id];

  return { handleShowModal, handleCloseModal, isModalOpen };
}

export const usePermission = (persist) => {
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    if (!persist) return;
    if (permission !== null) return;
    try {
      setPermission(JSON.parse(localStorage.getItem("permission")));
    } catch {
      console.warn("Failed to get permission data.");
    }
  });

  useEffect(() => {
    if (persist) return;
    if (permission !== null) return;
    try {
      setPermission(JSON.parse(localStorage.getItem("permission")));
    } catch {
      console.warn("Failed to get permission data.");
    }
  }, []);

  return permission;
};

export const useLocalStorage = (key, defaultValue) => {
  const [value] = useState(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue)
      );
    } catch {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  const set = (v) => localStorage.setItem(key, JSON.stringify(v));
  const clear = () => localStorage.removeItem(key);

  return [value, set, clear];
}

export const useRenderCount = (callback = console.log) => {
  const countRef = useRef(0)
  callback(countRef.current ++)  
}
