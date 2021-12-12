import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import Layout from "../components/global/Layout";
import "../styles/globals.css";
import AuthProvider from "../contexts/AuthContext";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, Arial",
  },
  palette: {
    primary: {
      main: "#3f51b5",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          src: local('Inter'), url(/static/fonts/Inter.ttf) format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
});

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>FIMA1</title>
        <meta name="description" content="FIMA1 Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Layout>
            <CssBaseline />
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
