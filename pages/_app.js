import "@/_metronic/assets/sass/style.react.scss";
import "@/_metronic/assets/fonticon/fonticon.css";
import "@/_metronic/assets/keenicons/duotone/style.css";
import "@/_metronic/assets/keenicons/outline/style.css";
import "@/_metronic/assets/keenicons/solid/style.css";
import "@/_metronic/assets/sass/style.scss";

import dynamic from "next/dynamic";
import Head from "next/head";

import { SessionProvider } from "next-auth/react";
import Detector from "../components/Detector";

import { MetronicI18nProvider } from "@/_metronic/i18n/Metronici18n";
import { LayoutProvider } from "@/_metronic/layout/core";

import ScreenLoad from "@/components/loading/ScreenLoad";

// need { MasterInit } to get sidebar work, but it require to control ther document node, so use dynamic import with no ssr
const DynamicMasterInit = dynamic(
  async () => {
    const { MasterInit } = await import("@/_metronic/layout/MasterInit");
    return MasterInit;
  },
  { ssr: false }
);

const DynamicWrapper = dynamic(
  async () => {
    const Layout = await import("@/layout/defaultLayout");
    return Layout;
  },
  { ssr: false, loading: () => <ScreenLoad /> }
);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // const queryClient = new QueryClient();

  const getLayout =
    Component.getLayout ?? ((page) => <DynamicWrapper>{page}</DynamicWrapper>);

  return getLayout(
    <SessionProvider session={session}>
      <>
        <Head>
          <title>YouCanBuy</title>
        </Head>
        <Detector>
          <MetronicI18nProvider>
            <LayoutProvider>
              <Component {...pageProps} />
              <DynamicMasterInit />
            </LayoutProvider>
          </MetronicI18nProvider>
        </Detector>
      </>
    </SessionProvider>
  );
}
