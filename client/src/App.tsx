import "./App.css";
import { lazy, useEffect, Suspense } from "react";
import Navbar from "./components/Layout/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { setAuthHeader, clearToken } from "./service/auth.service";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";

const Landing = lazy(() => import("./sections/1_Landing/Landing"));
const Analyze = lazy(() => import("./sections/2_Analyze/Analyze"));
const History = lazy(() => import("./sections/3_History/HIstiory"));
const Docs = lazy(() => import("./sections/4_Docs/Docs"));
const About = lazy(() => import("./sections/5_About/About"));
const Sign = lazy(() => import("./sections/6_Sign/Sign"));

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    setAuthHeader();
  }, []);

  useEffect(() => {
    const EXPIRE_MS = 60 * 60 * 1000;
    const ts = Number(localStorage.getItem("tokenSaveAt"));
    const now = Date.now();

    if (!ts || now - ts > EXPIRE_MS) {
      clearToken();
    } else {
      const timeout = setTimeout(() => {
        clearToken();
      }, EXPIRE_MS - (now - ts));

      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Suspense
        fallback={
          <div className="fixed-mid">
            <Spiral size="70" speed="0.95" color="black" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/history" element={<History />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign" element={<Sign />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
