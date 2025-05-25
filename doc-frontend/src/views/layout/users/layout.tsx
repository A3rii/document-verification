import Header from "../../../components/Header";
import { Outlet } from "react-router";
import Footer from "./../../../components/Footer";
export default function UserLayout() {
  return (
    <>
      <Header />

      <div className="">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
