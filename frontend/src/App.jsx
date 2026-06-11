import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CodeGeneratorPage from "./pages/CodeGeneratorPage.jsx";
import FirmwareGeneratorPage from "./pages/FirmwareGeneratorPage.jsx";
import HardwareDeviceDetailsPage from "./pages/HardwareDeviceDetailsPage.jsx";
import HardwareDeviceEditPage from "./pages/HardwareDeviceEditPage.jsx";
import HardwareLibraryPage from "./pages/HardwareLibraryPage.jsx";
import JsonPreviewPage from "./pages/JsonPreviewPage.jsx";
import LibraryDashboardPage from "./pages/LibraryDashboardPage.jsx";
import ProfilesPage from "./pages/ProfilesPage.jsx";
import ProjectValidationPage from "./pages/ProjectValidationPage.jsx";
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
          <Route path="/" element={<Navigate to="/project/dashboard" replace />} />

          <Route
            path="/library/hardware/:deviceId/edit"
            element={<HardwareDeviceEditPage />}
          />
          <Route path="/project/dashboard" element={<DashboardPage />} />
          <Route path="/project/projects" element={<ProjectsPage />} />
          <Route
            path="/project/projects/:id/*"
            element={<ProjectDetailsPage />}
          />
          <Route path="/project/validation" element={<ProjectValidationPage />} />
          <Route path="/project/json" element={<JsonPreviewPage />} />
          <Route
            path="/project/code-generator"
            element={<CodeGeneratorPage />}
          />
          <Route
            path="/project/firmware-generator"
            element={<FirmwareGeneratorPage />}
          />

          <Route path="/library/dashboard" element={<LibraryDashboardPage />} />
          <Route path="/library/templates" element={<TemplatesPage />} />
          <Route path="/library/hardware" element={<HardwareLibraryPage />} />
          <Route
            path="/library/hardware/:deviceId/*"
            element={<HardwareDeviceDetailsPage />}
          />
          <Route
            path="/library/hardware/:deviceId/edit"
            element={<HardwareDeviceEditPage />}
          />
          <Route path="/library/profiles" element={<ProfilesPage />} />
          <Route path="/library/settings" element={<SettingsPage />} />

          <Route path="/dashboard" element={<Navigate to="/project/dashboard" replace />} />
          <Route path="/projects" element={<Navigate to="/project/projects" replace />} />
          <Route
            path="/projects/:id/*"
            element={<Navigate to="/project/projects/:id" replace />}
          />
          <Route path="/templates" element={<Navigate to="/library/templates" replace />} />
          <Route path="/hardware" element={<Navigate to="/library/hardware" replace />} />
          <Route path="/json" element={<Navigate to="/project/json" replace />} />
          <Route
            path="/generator/code"
            element={<Navigate to="/project/code-generator" replace />}
          />
          <Route
            path="/generator/firmware"
            element={<Navigate to="/project/firmware-generator" replace />}
          />
          <Route path="/settings" element={<Navigate to="/library/settings" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/project/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
