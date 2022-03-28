import React, { useEffect, useContext } from "react";
import { AppContext } from "App";
import Footer from "Components/ServiceIntro/Footer";
import { Outlet } from "react-router-dom";

function ServiceIntro() {
  const { setIsMLML } = useContext(AppContext);
  useEffect(() => {
    setIsMLML(false);
  }, []);

  return (
    <>
      <main className="mt-16 h-auto min-h-full pb-16">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default ServiceIntro;
