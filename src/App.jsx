import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import { useState } from "react";

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <>
      <ScrollToTop />
      <Header userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
      <Outlet context={{ userLoggedIn, setUserLoggedIn }} />
    </>
  );
}
