import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import './adminstyling/admin_viewreport.css';

const ViewReport = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await axios.get('http://localhost:8081/api/report', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'report.pdf';
      link.click();
      setDownloading(false);
    } catch (error) {
      console.error('Error downloading report:', error);
      setDownloading(false);
    }
  };

  return (
    <div>
      <Sidebar role={'admin'} />
      <div className="d-flex justify-content-center">
        <button className={`btn-danger my-5`} onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Downloading...' : 'Download Report'}
        </button>
      </div>
    </div>
  );
};

export default ViewReport;