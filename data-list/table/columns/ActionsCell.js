import { useEffect } from "react";
import { useRouter } from "next/router";
import { MenuComponent } from "@/_metronic/assets/ts/components";
import { useListView } from "../../core/ListViewProvider";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import { useSession } from "next-auth/react";
import { deleteDataRequest } from "../../core/request";

const ActionsCell = ({ id }) => {
  const session = useSession();
  const router = useRouter();
  const { setItemIdForUpdate } = useListView();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const openEditModal = () => {
    setItemIdForUpdate(id);
  };

  const deleteItem = async () => {
    const accessToken = session.data?.user?.accessToken;
    if (!accessToken) return console.warn("Lost access token");

    await deleteDataRequest(accessToken, id);
    router.push(router.asPath.split("?")[0]);
  }

  return (
    <>
      <DropdownButton
        size="sm"
        variant="secondary"
        title="操作"
        id={`dropdown-button-drop-0`}
        key={0}
      >
        {/* <Dropdown.Item eventKey="1">Action</Dropdown.Item> */}
        <Dropdown.Item onClick={openEditModal}>編輯</Dropdown.Item>
        <Dropdown.Item onClick={deleteItem}>刪除</Dropdown.Item>
        {/* <Dropdown.Item eventKey="3">Something else here</Dropdown.Item> */}
        {/* <Dropdown.Divider /> */}
        {/* <Dropdown.Item eventKey="4">Separated link</Dropdown.Item> */}
      </DropdownButton>
    </>
  );
};

export { ActionsCell };
