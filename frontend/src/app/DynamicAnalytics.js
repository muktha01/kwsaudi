"use client";
import { useEffect, useState } from "react";

export default function DynamicAnalytics() {
  const [headerScript, setHeaderScript] = useState("");
//   const [footerScript, setFooterScript] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/api/api-management/")
      .then((res) => res.json())
      .then((data) => {
        setHeaderScript(data.header || "");
        // setFooterScript(data.footer || "");
      });
  }, []);

  useEffect(() => {
    if (headerScript) {
      const headerDiv = document.createElement("div");
      headerDiv.innerHTML = headerScript;
      Array.from(headerDiv.children).forEach((el) => {
        document.head.appendChild(el);
      });
    }
    // if (footerScript) {
    //   const footerDiv = document.createElement("div");
    //   footerDiv.innerHTML = footerScript;
    //   Array.from(footerDiv.children).forEach((el) => {
    //     document.body.appendChild(el);
    //   });
    // }
    // Cleanup: Optionally remove injected scripts on unmount
    // Not implemented for simplicity
  }, [headerScript]);

  return null;
}
