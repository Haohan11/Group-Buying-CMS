import { SidebarMenuItem } from "@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItem";

import icons from "@/_metronic/helpers/icons-config/icons";

const IconPreviewPage = () => {
  return (
    <div className="p-10">
      <h2>
        Here only list Icons from "@/_metronic/helpers/icons-config/icons"
      </h2>
      <h2>
        Use Bootstrap Icon visit{" "}
        <a href="https://icons.getbootstrap.com">
          https://icons.getbootstrap.com
        </a>
      </h2>
      <div className="pe-none">
        {Object.keys(icons).map((key, index) => (
          <SidebarMenuItem
            key={index}
            to="#"
            title={key}
            icon={`bi bi-${key}`}
          />
        ))}
      </div>
    </div>
  );
};

export default IconPreviewPage;
