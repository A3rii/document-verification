import Cookies from "js-cookie";

export default function authToken() {
  const token = Cookies.get("token") || "";
  return token;
}
