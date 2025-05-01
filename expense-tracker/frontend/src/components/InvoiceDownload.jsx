import React from "react";
import axios from "../services/api";

const InvoiceDownload = () => {
  const handleDownload = async () => {
    try {
      // Change the URL if necessary to include the full backend URL with the correct port
      const response = await axios.get("http://localhost:8080/api/invoice/download", { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "invoice.pdf"; // Filename can be dynamic as needed
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
