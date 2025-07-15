import React, { useState } from "react";
import { Download } from "lucide-react";
import axios from "axios";

const CSVDownloadButton = ({ type = "all", eventId = null, status = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://aiesecinruhuna-production.up.railway.app/analytics/registrations/export", {
        params: { type, eventId, status },
        responseType: "blob", // important for file download
      });

      // Create a blob URL and simulate link click for download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      
      // Generate filename based on filters
      const filename = `registrations_${eventId ? `event_${eventId}` : 'all'}_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute("download", filename);
      
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download CSV. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{loading ? "Downloading..." : "Export CSV"}</span>
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CSVDownloadButton;