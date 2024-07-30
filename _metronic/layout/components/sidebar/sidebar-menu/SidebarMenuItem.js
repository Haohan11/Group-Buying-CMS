import { FC } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { checkIsActive, KTIcon, WithChildren } from "../../../../helpers";
import { useLayout } from "../../../core";

const SidebarMenuItem = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
}) => {
  const { asPath } = useRouter();

  const isActive = checkIsActive(asPath, to);
  const { config } = useLayout();
  const { app } = config;

  return (
    <div className="menu-item">
      <Link
        href={to}
        className={clsx(`menu-link without-sub`, {
          active: isActive,
          "pe-none": isActive,
        })}
      >
        {hasBullet && (
          <span className="menu-bullet">
            <span className="bullet bullet-dot"></span>
          </span>
        )}
        {icon && app?.sidebar?.default?.menu?.iconType === "svg" && (
          <span className="menu-icon">
            {" "}
            <KTIcon iconName={icon} className="fs-2" />
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === "font" && (
          <i className={clsx("bi fs-3", fontIcon)}></i>
        )}
        <span className="menu-title">{title}</span>
      </Link>
      {children}
    </div>
  );
};

export { SidebarMenuItem };
