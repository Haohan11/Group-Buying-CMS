import { useEffect } from "react";
import { MenuComponent } from "@/_metronic/assets/ts/components";
import { useListView } from "../../core/ListViewProvider";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const ActionsCell = ({ id }) => {
  const { setItemIdForUpdate } = useListView();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const openEditModal = () => {
    setItemIdForUpdate(id);
  };

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
        {/* <Dropdown.Item eventKey="3">Something else here</Dropdown.Item> */}
        {/* <Dropdown.Divider /> */}
        {/* <Dropdown.Item eventKey="4">Separated link</Dropdown.Item> */}
      </DropdownButton>
    </>
  );
};

export { ActionsCell };
