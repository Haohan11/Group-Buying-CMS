import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { checkIsActive, KTIcon, WithChildren } from "../../../../helpers";
import { signOut } from "next-auth/react";

import { getIndexItems, updateIndexItem } from "@/data-list/core/request";

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

      indexItems && setItems(indexItems);
    })();
  }, []);

  return (
    <>
      {checkArray(items) &&
        items.map((item) => {
          return (
            <SidebarMenuItemWithSub
              key={item.id}
              title={item.name}
              icon={`bi bi-${item.icon}`}
              to={item.route}
            >
              {checkArray(item.indexItems) &&
                item.indexItems.map((child) => {
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
          );
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
      {false && <div className="menu-item">
        <div
          className={clsx("menu-link without-sub")}
          onClick={async () => {
            try {
              /** fetch `/` max 120 */
              /** fetch `/get-index-item` max 25 */
              /** fetch `/sale-management` max 18 */
              /** fetch `/stock-backend` max 12 */
              const times = 50;
              await Promise.all(
                [...new Array(times)].map(
                  async () =>
                    await fetch(
                      `${process.env.NEXT_PUBLIC_BACKENDURL}/stock-backend`,
                      {
                        headers: {
                          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJfYWNjb3VudCI6ImFkbWluIiwidXNlcl9wYXNzd29yZCI6IjEyMzQ1NiJ9LCJleHAiOjE3MjM2MzA5NjcsImlhdCI6MTcyMzYwMjE2N30.P9mGvtsxiCkyN_PEDqjcmx467mfPIMjjYph76OrGaig`,
                        },
                      }
                    )
                )
              );
            } catch (error) {
              console.warn(error);
            }
          }}
        >
          <span className="menu-icon">
            {" "}
            <KTIcon iconName="bi bi-cone-striped" className="fs-2" />
          </span>
          <span className="menu-title">Test Fetch</span>
        </div>
      </div>}
    </>
  );
};

export { SidebarMenuMain };
