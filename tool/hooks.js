import { useState, useEffect } from "react";

export const useInputFilePath = () => {
  const [src, setSrc] = useState(null);

  const handleChooseFile = (event) => {
    const [file] = event.target.files;
    if (!file) return;
    setSrc(URL.createObjectURL(file));
  };

  return [src, handleChooseFile];
};

export const useGroupInputFilePath = (init) => {
  const [srcArray, setSrcArray] = useState(init);

  const handleChooseFile = (event, index) => {
    const [file] = event.target.files;
    if (!file) return;
    setSrcArray((prev) => {
      prev[index] = URL.createObjectURL(file);
      return [...prev];
    });
  };

  return [srcArray, setSrcArray, handleChooseFile];
};

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

export const checkExpires = (time) =>
  time ? time * 1000 < Date.now() : console.log("Invalid exp.");
