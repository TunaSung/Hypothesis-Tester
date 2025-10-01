import FeatureItem from "./components/FeatureItem";
import StatItem from "./components/StatItem";
import { FEATURES, STATS } from "./data/About.data";

function About() {
  return (
    <div className="bg-sky-100/40">
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
        <section className="bg-teal-100/80 rounded-3xl p-12 mb-12 border border-green-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Our Mission
            </h2>
            <p className="text-sm sm:text-xl text-slate-700 mx-auto leading-relaxed">
              We believe that statistical analysis shouldn't be a barrier to
              discovery. Our AI-powered platform democratizes statistical
              testing by making it intuitive, accurate, and accessible to
              everyone—from undergraduate students to seasoned researchers.
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
              <FeatureItem key={feature.title} feature={feature} />
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
      </div>
    </div>
  );
}

export default About;
