import { createBrowserRouter } from "react-router-dom";
import HomeJobs from "../pages/HomeJobs";
import AdminBoard from "../pages/admin/AdminBoard";
import ApplyWizard from "../pages/ApplyWizard";
import ThankYou from "../pages/ThankYou";
import AdminApplication from "../pages/admin/AdminApplication";

export const router = createBrowserRouter([
  { path: "/", element: <HomeJobs /> },
  { path: "/jobs/:jobId/apply", element: <ApplyWizard /> },
  { path: "/thank-you/:applicationId", element: <ThankYou /> },

  { path: "/admin", element: <AdminBoard /> },
  { path: "/admin/applications/:applicationId", element: <AdminApplication /> },
]);
