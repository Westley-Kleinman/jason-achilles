/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ObservationDeck } from './pages/ObservationDeck';
import { SchematicRepository } from './pages/SchematicRepository';
import { Discography } from './pages/Discography';
import { LogisticsHub } from './pages/LogisticsHub';
import { ResearchLogs } from './pages/ResearchLogs';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<ObservationDeck />} />
          <Route path="/schematics" element={<SchematicRepository />} />
          <Route path="/discography" element={<Discography />} />
          <Route path="/logistics" element={<LogisticsHub initialTab="TRAJECTORY" />} />
          <Route path="/merch" element={<LogisticsHub initialTab="SURPLUS" />} />
          <Route path="/research" element={<ResearchLogs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}


