import Header from "../../../components/users/Header";
import { Outlet } from "react-router";
import Footer from "../../../components/users/Footer";
export default function UserLayout() {
  return (
    <>
      <Header />
      <div className="w-container mx-auto px-4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
