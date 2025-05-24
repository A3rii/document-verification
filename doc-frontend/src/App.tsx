import { BrowserRouter as Router, Route, Routes } from "react-router";
import Layout from "./views/layout/admin/layout";
import UserLayout from "./views/layout/users/layout";
import {
  Dashboard,
  Document,
  Student,
  DocumentForm,
} from "./views/pages/dashboard/index";
import Login from "./views/pages/auth/Login";
import { Home, Verify } from "./views/pages/users/index";
export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* public route */}
          <Route path="/login" element={<Login />} />

          {/* admin access route  */}
          <Route path="admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="documents" element={<Document />} />
              <Route path="document-form" element={<DocumentForm />} />
            <Route path="students" element={<Student />} />
          </Route>

          {/* user access route  */}

          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verify />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
