import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { checkIsActive, KTIcon, WithChildren } from "../../../../helpers";
import { signOut } from "next-auth/react";

import { getIndexItems } from "@/data-list/core/request";

import { usePermission } from "@/tool/hooks";
import { checkArray } from "@/tool/helper";

const SidebarMenuMain = () => {
  const logout = async () => {
    signOut({ callbackUrl: "/login" });
  };
  const permission = usePermission(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const indexItems = await getIndexItems();

      setItems(indexItems);
    })()
  }, []);

  return (
    <>
    {checkArray(items) && items.map((item) => {
      return (
        <SidebarMenuItemWithSub
          key={item.id}
          title={item.name}
          icon={`bi bi-${item.icon}`}
        >
          {checkArray(item.indexItems) && item.indexItems.map((child) => {
            return (
              <SidebarMenuItem
                key={child.id}
                to={`${item.route}/${child.route}`}
                title={child.name}
                hasBullet
              />
            );
          })}
        </SidebarMenuItemWithSub>
      )
    })}
      <div className="menu-item">
        <Link
          href="/"
          className={clsx("menu-link without-sub")}
          onClick={logout}
        >
          <span className="menu-icon">
            {" "}
            <KTIcon iconName="bi bi-box-arrow-left" className="fs-2" />
          </span>
          <span className="menu-title">登出</span>
        </Link>
      </div>
    </>
  );
};

export { SidebarMenuMain };
