import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

type Props = undefined;

class Document extends NextDocument<Props> {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {/*Wrapper for modal*/}
          <div id="modal" style={{ position: "relative" }}></div>
        </body>
      </Html>
    );
  }
}

export default Document;
