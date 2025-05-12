import { BrowserRouter as Router, Route, Routes } from "react-router";
import Layout from "./views/layout/admin/layout";
import UserLayout from "./views/layout/users/layout";
import {
  Dashboard,
  Document,
  Student,
  Login,
} from "./views/pages/dashboard/index";
import Home from "./views/pages/users/Home";
export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="documents" element={<Document />} />
            <Route path="students" element={<Student />} />
          </Route>

          <Route element={<UserLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
