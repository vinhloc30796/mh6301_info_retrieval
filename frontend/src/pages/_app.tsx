import "@/styles/globals.css";
import type { AppProps } from "next/app";
// React
import { useState } from "react";


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
