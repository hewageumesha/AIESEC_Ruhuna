import React from "react";
import axios from "../services/api";

const InvoiceDownload = () => {
  const handleDownload = async () => {
    try {
      const response = await axios.get("/invoice/download", { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "invoice.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  return <button onClick={handleDownload}>Download Invoice</button>;
};

export default InvoiceDownload;
