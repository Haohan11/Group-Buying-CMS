import { Sidebar } from "@/_metronic/layout/components/sidebar";
import { HeaderWrapper } from "@/_metronic/layout/components/header";
import { FooterWrapper } from "@/_metronic/layout/components/footer";
import { PageDataProvider } from "@/_metronic/layout/core";
import { ScrollTop } from '@/_metronic/layout/components/scroll-top'

const defaultLayout = ({ children }) => {
  return (
    <PageDataProvider>
      {/* add vh-100 for flex-grow work */}
      <div className="d-flex flex-column flex-root app-root vh-100" id="kt_app_root">
        <div
          className="app-page flex-column flex-column-fluid"
          id="kt_app_page"
        >
          <HeaderWrapper />
          <div
            className="app-wrapper flex-column flex-row-fluid"
            id="kt_app_wrapper"
          >
            <Sidebar />
            <div
              className="app-main flex-column flex-row-fluid"
              id="kt_app_main"
            >
              <div className="d-flex flex-column flex-column-fluid">
                {children}
              </div>
              <FooterWrapper />
            </div>
          </div>
        </div>
      </div>
      <ScrollTop />
    </PageDataProvider>
  );
};

export default defaultLayout;
