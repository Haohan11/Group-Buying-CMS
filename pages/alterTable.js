import Notfound from "@/pages/404";
import VersionCode from "@/components/VersionCode";
import { alterSyncTables } from "@/data-list/core/request";

const AlterSyncTable = () => {
  return (
    <>
      <Notfound />
      <div
        onClick={async () => {
          const password = window.prompt("Enter code to Alter Sync table:");
          if (password === "i2c") {
            const res = await alterSyncTables();
            console.log(res);
          }
        }}
        className="position-fixed py-2 px-3 bottom-0 end-0 fs-6-xs"
        style={{ color: "grey" }}
      >
        <VersionCode />
      </div>
    </>
  );
};

AlterSyncTable.getLayout = (page) => page;

export default AlterSyncTable;
