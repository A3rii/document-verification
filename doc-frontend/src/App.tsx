import { BrowserRouter as Router, Route, Routes } from "react-router";
import Layout from "./views/layout/admin/layout";
import { Dashboard, Document, Student } from "./views/pages/dashboard/index";
export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="documents" element={<Document />} />
            <Route path="students" element={<Student />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
