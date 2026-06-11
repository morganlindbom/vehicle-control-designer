import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CodeGeneratorPage from "./pages/CodeGeneratorPage.jsx";
import FirmwareGeneratorPage from "./pages/FirmwareGeneratorPage.jsx";
import HardwareProfilesPage from "./pages/HardwareProfilesPage.jsx";
import JsonPreviewPage from "./pages/JsonPreviewPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProjectDetailsPage from "./pages/ProjectDetailsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import TemplatesPage from "./pages/TemplatesPage.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id/*" element={<ProjectDetailsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/hardware" element={<HardwareProfilesPage />} />
          <Route path="/json" element={<JsonPreviewPage />} />
          <Route path="/generator/code" element={<CodeGeneratorPage />} />
          <Route
            path="/generator/firmware"
            element={<FirmwareGeneratorPage />}
          />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
