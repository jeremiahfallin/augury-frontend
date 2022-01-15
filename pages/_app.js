import NProgress from "nprogress";
import Router from "next/router";
import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
  Provider,
} from "urql";

import Page from "../components/Page";
import { AuthProvider } from "../components/Auth";

import "../components/styles/nprogress.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const isServerSide = typeof window === "undefined";
const ssrCache = ssrExchange({ isClient: !isServerSide });
const client = createClient({
  url: isServerSide ? "/api/graphql" : "/api/graphql",
  exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
});

function App({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <AuthProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </AuthProvider>
    </Provider>
  );
}

App.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

export default App;
