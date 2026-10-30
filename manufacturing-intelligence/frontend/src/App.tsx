import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import OverviewPage from './pages/OverviewPage';
import CompanyExplorerPage from './pages/CompanyExplorerPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import DataCollectionPage from './pages/DataCollectionPage';
import DataQualityPage from './pages/DataQualityPage';
import ExportCenterPage from './pages/ExportCenterPage';

export const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/explorer" element={<CompanyExplorerPage />} />
        <Route path="/companies/:id" element={<CompanyProfilePage />} />
        <Route path="/collection" element={<DataCollectionPage />} />
        <Route path="/quality" element={<DataQualityPage />} />
        <Route path="/export" element={<ExportCenterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;

