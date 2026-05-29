import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Evita piscadas na tela durante o carregamento

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
      }
      setLoading(false); // Carregamento do Firebase finalizado
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  if (loading) {
    return <div>Carregando...</div>; // Tela de espera enquanto o Firebase valida o usuário
  }

  return (
    <>
      <ScrollToTop />
      <Header userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
      <Outlet context={{ userLoggedIn, setUserLoggedIn }} />
    </>
  );
}
