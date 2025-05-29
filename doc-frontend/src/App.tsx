import { BrowserRouter as Router, Route, Routes } from "react-router";
import Layout from "./views/layout/admin/layout";
import UserLayout from "./views/layout/users/layout";
import LoginUserLayout from "./views/layout/users/loginUserLayout";
import {
  Dashboard,
  Document,
  Student,
  DocumentForm,
  StudentForm,
} from "./views/pages/dashboard/index";
import Login from "./views/pages/auth/Login";
import AdminRegister from "./views/pages/auth/AdminRegister";
import { Home, Verify, StudentDocument } from "./views/pages/users/index";
export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* public route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register/admin" element={<AdminRegister />} />

          {/* admin access route  */}
          <Route path="admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="documents" element={<Document />} />
            <Route path="document-form" element={<DocumentForm />} />
            <Route path="students" element={<Student />} />
            <Route path="students-form" element={<StudentForm />} />
          </Route>

          {/* user access route  */}

          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verify />} />
          </Route>

          <Route path="user" element={<LoginUserLayout />}>
            <Route index path="certificate" element={<StudentDocument />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
