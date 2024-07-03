import React from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { checkIsActive, KTIcon, WithChildren } from "../../../../helpers";
import { useLayout } from "../../../core";

const SidebarMenuItemWithSub = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet,
}) => {
  const { asPath } = useRouter();
  const isActive = checkIsActive(asPath, to);
  const { config } = useLayout();
  const { app } = config;

  return (
    <div
      className={clsx(
        "menu-item",
        { "here show": isActive },
        "menu-accordion"
      )}
      data-kt-menu-trigger="click"
    >
      <span className="menu-link">
        {hasBullet && (
          <span className="menu-bullet">
            <span className="bullet bullet-dot"></span>
          </span>
        )}
        {icon && app?.sidebar?.default?.menu?.iconType === "svg" && (
          <span className="menu-icon">
            <KTIcon
              iconName={icon}
              className={`fs-2 ${isActive && "text-primary"}`}
            />
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === "font" && (
          <i className={clsx("bi fs-3", fontIcon)}></i>
        )}
        <span className={`menu-title ${isActive && "text-primary"}`}>{title}</span>
        <span className="menu-arrow"></span>
      </span>
      <div
        className={clsx("menu-sub menu-sub-accordion", {
          "menu-active-bg": isActive,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export { SidebarMenuItemWithSub };
