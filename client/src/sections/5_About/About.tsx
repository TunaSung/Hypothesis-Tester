import FeatureItem from "./components/FeatureItem";
import StatItem from "./components/StatItem";
import { FEATURES, STATS } from "./data/About.data";

function About() {
  return (
    <div className="container-mid py-8">

      {/* Start Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          About AI Hypothesis Tester
        </h1>
        <p className="text-slate-600">
          Making statistical analysis accessible to researchers, students, and
          professionals
        </p>
      </header>
      {/* End Header */}

      {/* Start Mission */}
      <section className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-12 mb-12 border border-blue-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Our Mission
          </h2>
          <p className="text-sm sm:text-xl text-slate-700 mx-auto leading-relaxed">
            We believe that statistical analysis shouldn't be a barrier to
            discovery. Our AI-powered platform democratizes statistical testing
            by making it intuitive, accurate, and accessible to everyone—from
            undergraduate students to seasoned researchers.
          </p>
        </div>
      </section>
      {/* End Mission */}

      {/* Start Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
          What Makes Us Different
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {FEATURES.map((feature) => (
            <FeatureItem key={feature.title} feature={feature}/>
          ))}
        </div>
      </section>
      {/* End Features */}

      {/* Start Stats */}
      <section className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
          By the Numbers
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <StatItem key={stat.title} stat={stat} />
          ))}
        </div>
      </section>
      {/* End Stats */}

      {/* Start Contact */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Get in Touch</h2>
        <p className="text-slate-600 mb-6">
          Have questions, feedback, or need help with your analysis? We'd love
          to hear from you.
        </p>
        <div className="flex justify-center space-x-6">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
          <button className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors">
            Request Feature
          </button>
        </div>
      </section>
      {/* End Contact */}

    </div>
  );
}

export default About;
