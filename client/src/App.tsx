import "./App.css";
import { lazy } from "react";
import Navbar from "./components/Layout/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Landing = lazy(() => import("./sections/1_Landing/Landing"));
const Analyze = lazy(() => import("./sections/2_Analyze/Analyze"));
const History = lazy(() => import("./sections/3_History/HIstiory"));
const Docs = lazy(() => import("./sections/4_Docs/Docs"));
const About = lazy(() => import("./sections/5_About/About"));
const Sign = lazy(() => import("./sections/6_Sign/Sign"));

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/history" element={<History />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign" element={<Sign />} />
      </Routes>
    </Router>
  );
}

export default App;
