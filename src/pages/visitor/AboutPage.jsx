// src/pages/visitor/AboutPage.jsx
// Page À propos de l'application d'entraînement de natation

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWater, 
  FaChartLine, 
  FaBook, 
  FaUsers, 
  FaCheck, 
  FaTrophy,
  FaSwimmer,
  FaRunning,
  FaBicycle,
  FaHeartbeat,
  FaLightbulb,
  FaUserFriends,
  FaChevronRight,
  FaSwimmingPool,
  FaMedal,
  FaBalanceScale,
  FaMountain,
  FaRegComment,
  FaStopwatch,
  FaCompass
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

// Composant pour les cartes de valeurs
const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="card h-100 shadow-sm hover-lift border-0">
    <div className="card-body p-4">
      <div className="d-flex align-items-center mb-3">
        <div className="bg-primary-subtle p-3 rounded-circle me-3">
          <Icon className="text-primary fs-3" />
        </div>
        <h3 className="h5 mb-0">{title}</h3>
      </div>
      <p className="text-muted mb-0">{description}</p>
    </div>
  </div>
);

// Composant pour les membres de l'équipe
const TeamMember = ({ name, role, description, imagePlaceholder }) => (
  <div className="card h-100 shadow-sm border-0">
    <div className="card-body p-4">
      <div className="text-center mb-3">
        <div 
          className="rounded-circle bg-primary text-white mx-auto mb-3 d-flex align-items-center justify-content-center" 
          style={{width: '120px', height: '120px'}}
        >
          <span className="display-6">{imagePlaceholder}</span>
        </div>
        <h4 className="h5 mb-1">{name}</h4>
        <p className="text-primary fw-semibold mb-2">{role}</p>
      </div>
      <p className="text-muted small mb-0">{description}</p>
    </div>
  </div>
);

// Composant pour les témoignages clients
const Testimonial = ({ quote, name, role }) => (
  <div className="card h-100 border-0 shadow-sm">
    <div className="card-body p-4">
      <div className="mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-warning">★</span>
        ))}
      </div>
      <p className="mb-4 fst-italic">"{quote}"</p>
      <div className="d-flex align-items-center">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '45px', height: '45px'}}>
          <span className="fw-bold">{name.charAt(0)}</span>
        </div>
        <div>
          <h5 className="mb-0 fw-semibold">{name}</h5>
          <small className="text-muted">{role}</small>
        </div>
      </div>
    </div>
  </div>
);

const AboutPage = () => {
  // Valeurs de l'entreprise
  const values = [
    {
      icon: FaHeartbeat,
      title: "Passion authentique",
      description: "Nous sommes avant tout des athlètes et des entraîneurs passionnés de natation et de triathlon, qui vivent leurs disciplines au quotidien."
    },
    {
      icon: FaUserFriends,
      title: "Expertise pratique",
      description: "Nous utilisons notre propre application quotidiennement pour nos entraînements, ce qui nous permet de l'améliorer constamment selon les besoins réels."
    },
    {
      icon: FaBalanceScale,
      title: "Équilibre optimal",
      description: "Nous promouvons un équilibre sain entre performance sportive et bien-être, avec une approche holistique de l'entraînement aquatique."
    },
    {
      icon: FaLightbulb,
      title: "Innovation constante",
      description: "Notre immersion totale dans le monde de la natation nous permet d'innover et d'améliorer continuellement nos outils et méthodes."
    }
  ];

  // Membres de l'équipe
  const teamMembers = [
    { 
      name: 'MedHassan E', 
      role: 'Fondateur & Entraineur', 
      imagePlaceholder: 'HE',
      description: "Ancien nageur de compétition et coach certifié, Hassan a créé NSAPP pour combler un manque d'outils adaptés aux besoins spécifiques des nageurs de tous niveaux."
    },
    { 
      name: 'Marie D', 
      role: 'Coach Principale', 
      imagePlaceholder: 'MD',
      description: "Avec 15 ans d'expérience en coaching de natation et titulaire d'un master en sciences du sport, Marie supervise le contenu technique et les méthodologies d'entraînement."
    },
    { 
      name: 'Steve MV', 
      role: 'Développeur & Triathlète', 
      imagePlaceholder: 'AM',
      description: "Passionné de triathlon, Steve allie expertise technique et compréhension profonde des besoins des athlètes pour développer un outils intuitive."
    }
  ];

  // Témoignages
  const testimonials = [
    {
      quote: "En tant qu'entraîneur de club, cette application a transformé ma façon de gérer les programmes de mes nageurs. Je peux maintenant personnaliser facilement chaque plan selon les besoins spécifiques.",
      name: "Thomas L.",
      role: "Coach de club de natation"
    },
    {
      quote: "L'approche de NSAPP est unique car on sent que les créateurs sont eux-mêmes des pratiquants passionnés. Les exercices et plans sont vraiment adaptés à la réalité de notre sport.",
      name: "Sophie M.",
      role: "Nageuse de compétition"
    }
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-white py-5">
          <div className="container py-4">
            <div className="row align-items-center">
              <div className="col-lg-7 mb-4 mb-lg-0">
                <div className="d-flex align-items-center mb-3">
                  <FaWater className="me-3 fs-1" />
                  <h1 className="display-4 fw-bold mb-0">Notre histoire</h1>
                </div>
                <p className="lead mb-4">
                  Une équipe de passionnés qui comprend vos défis car nous les vivons aussi. Découvrez qui nous sommes et ce qui nous anime.
                </p>
              </div>
              <div className="col-lg-5 text-center">
                <div className="bg-white p-3 rounded shadow-sm">
                  <img src="/assets/images/banner/nataswim_app_banner_3.jpg" alt="Notre équipe" className="img-fluid rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notre mission section */}
        <section className="py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h2 className="fw-bold mb-4">Notre mission</h2>
                <p className="mb-4">
                  Nous sommes avant tout des athlètes et des entraîneurs passionnés de natation et de triathlon. Nous comprenons les défis et les joies de ces disciplines, car nous les vivons au quotidien.
                </p>
                <p className="mb-4">
                  Notre mission : vous aider, athlètes motivés, à atteindre vos objectifs, qu'il s'agisse de boucler votre premier triathlon, d'améliorer vos temps en piscine ou de préparer une compétition de haut niveau.
                </p>
                <div className="d-flex align-items-center mb-3">
                  <FaCheck className="text-success me-3" />
                  <p className="mb-0">Accompagnement personnalisé pour tous les niveaux</p>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <FaCheck className="text-success me-3" />
                  <p className="mb-0">Outils conçus par des pratiquants pour des pratiquants</p>
                </div>
                <div className="d-flex align-items-center">
                  <FaCheck className="text-success me-3" />
                  <p className="mb-0">Amélioration continue basée sur notre propre expérience</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row row-cols-2 g-3">
                  <div className="col">
                    <div className="card border-0 bg-light h-100">
                      <div className="card-body text-center p-4">
                        <FaSwimmer className="text-primary mb-3" size={40} />
                        <h4 className="h6">Natation</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card border-0 bg-light h-100">
                      <div className="card-body text-center p-4">
                        <FaBicycle className="text-primary mb-3" size={40} />
                        <h4 className="h6">Cyclisme</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card border-0 bg-light h-100">
                      <div className="card-body text-center p-4">
                        <FaRunning className="text-primary mb-3" size={40} />
                        <h4 className="h6">Course à pied</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card border-0 bg-light h-100">
                      <div className="card-body text-center p-4">
                        <FaTrophy className="text-primary mb-3" size={40} />
                        <h4 className="h6">Triathlon</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notre approche unique */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Notre approche unique</h2>
              <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
                Nous sommes nos propres utilisateurs, ce qui nous donne une perspective inégalée
              </p>
            </div>
            
            <div className="row mb-5">
              <div className="col-md-6">
                <div className="bg-white rounded shadow-sm p-4 h-100">
                  <h3 className="h5 mb-3 d-flex align-items-center">
                    <FaSwimmingPool className="text-primary me-2" />
                    Une immersion totale
                  </h3>
                  <p className="text-muted mb-0">
                    Nous utilisons notre application quotidiennement pour nos entraînements en natation, nos sorties à vélo, nos séances de course à pied et nos compétitions de triathlon. Cette immersion totale nous permet de concevoir et d'améliorer constamment l'outil, en nous assurant qu'il répond parfaitement aux besoins des triathlètes et des nageurs.
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-white rounded shadow-sm p-4 h-100">
                  <h3 className="h5 mb-3 d-flex align-items-center">
                    <FaCompass className="text-primary me-2" />
                    Un environnement inspirant
                  </h3>
                  <p className="text-muted mb-0">
                    Notre environnement de travail est unique, imprégné de la passion du sport. En vous promenant dans nos bureaux, vous croiserez des combinaisons de natation, des vélos de contre-la-montre et des chaussures de course. Les conversations porteront sur les dernières compétitions, les techniques de nage, les stratégies de transition et les défis de l'entraînement combiné.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-4">
                <div className="bg-white rounded shadow-sm p-4 h-100">
                  <h3 className="h6 mb-3 d-flex align-items-center">
                    <FaBalanceScale className="text-primary me-2" />
                    Équilibre vie sportive et professionnelle
                  </h3>
                  <p className="text-muted small mb-0">
                    Nous privilégions un équilibre sain entre vie professionnelle et sportive, avec des horaires flexibles qui vous permettent de vous entraîner à votre guise.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-white rounded shadow-sm p-4 h-100">
                  <h3 className="h6 mb-3 d-flex align-items-center">
                    <FaMountain className="text-primary me-2" />
                    Cadre idéal pour l'entraînement
                  </h3>
                  <p className="text-muted small mb-0">
                    Situés au cœur d'une région propice à la pratique du sport, nous bénéficions d'un accès privilégié à des sites d'entraînement exceptionnels en eau libre, en montagne et sur route.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-white rounded shadow-sm p-4 h-100">
                  <h3 className="h6 mb-3 d-flex align-items-center">
                    <FaStopwatch className="text-primary me-2" />
                    Installations modernes
                  </h3>
                  <p className="text-muted small mb-0">
                    Profitez de nos installations d'entraînement indoor ultramodernes, idéales pour les séances de home trainer et de tapis de course, avec des outils d'analyse de performance intégrés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Nos valeurs</h2>
              <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
                Ce qui nous guide au quotidien dans notre approche et nos décisions
              </p>
            </div>
            
            <div className="row g-4">
              {values.map((value, index) => (
                <div key={index} className="col-md-6">
                  <ValueCard 
                    icon={value.icon}
                    title={value.title}
                    description={value.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notre équipe */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Notre équipe</h2>
              <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
                Des passionnés de natation et de triathlon à votre service
              </p>
            </div>
            
            <div className="row g-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="col-md-4">
                  <TeamMember 
                    name={member.name}
                    role={member.role}
                    description={member.description}
                    imagePlaceholder={member.imagePlaceholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Ce que disent nos utilisateurs</h2>
              <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
                Découvrez comment notre approche a aidé d'autres professionnels et athlètes
              </p>
            </div>
            
            <div className="row g-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="col-md-6">
                  <Testimonial
                    quote={testimonial.quote}
                    name={testimonial.name}
                    role={testimonial.role}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-5 bg-primary text-white text-center">
          <div className="container py-3">
            <h2 className="mb-4 fw-bold">Rejoignez notre communauté de passionnés</h2>
            <p className="lead mb-4 mx-auto" style={{ maxWidth: "700px" }}>
              Avec nous, votre passion pour la natation et le triathlon fait partie intégrante de votre expérience. Rejoignez une équipe qui partage votre passion et qui vous aidera à atteindre vos rêves.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;