import StepCard from "./components/StepCard";
import FeatureCard from "./components/FeatureCard";
import { FEATURES, STEPS } from "./datas/Landing.data";
import { Link } from "react-router-dom";
import { useAuth } from "../../components/Context/authContext";

function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-sky-100/40">
      <div aria-labelledby="landing-hero-title" className="container-mid py-16">
        {/* Start Hero Section */}
        <header className="text-center mb-20 flex flex-col items-center gap-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Statistical Testing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Made Simple
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Upload your data, ask your research question in plain English, and
            get professional statistical analysis with clear explanations and
            beautiful visualizations.
          </p>
          <Link
            to={isAuthenticated ? "/analyze" : "/sign"}
            aria-label="Get started with statistical testing"
            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold 
            hover:from-blue-700 hover:to-teal-700 transition-all duration-250 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transform"
          >
            Get Started
          </Link>
        </header>
        {/* End Hero Section */}

        {/* Start Features */}
        <section
          aria-labelledby="features-title"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.key}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </section>
        {/* End Features */}

        {/* Start Step */}
        <section
          aria-labelledby="how-it-works-title"
          className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100"
        >
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            How It Works
          </h2>
          <ul
            className="grid md:grid-cols-3 gap-8"
            aria-label="Steps to run an analysis"
          >
            {STEPS.map((step) => (
              <li key={step.key}>
                <StepCard
                  step={step.step}
                  title={step.title}
                  description={step.description}
                  gradient={step.gradient}
                />
              </li>
            ))}
          </ul>
        </section>
        {/* End Step */}
      </div>
    </div>
  );
}

export default Landing;
