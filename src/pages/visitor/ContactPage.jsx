// src/pages/visitor/ContactPage.jsx
// Page de contact interactive pour votre projet. 
// Cette page se trouve dans src/pages/visitor/ContactPage.jsx

// ❌❓🚨 Validation côté serveur ## endpoint API a configuré dans le backend

import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaPaperPlane 
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur lorsque l'utilisateur commence à corriger
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validation du prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    // Validation du nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Adresse email invalide';
    }
    
    // Validation du téléphone (optionnel mais doit être valide si fourni)
    if (formData.phone && !/^[0-9+\s()-]{8,15}$/i.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    
    // Validation du sujet
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    
    // Validation du message
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Le message doit contenir au moins 20 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // ❌❓🚨 Simulation d'un appel API
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // ❌❓🚨 Simulation d'un délai de réponse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ❌❓🚨 Simulation d'une réponse réussie
      // if (!response.ok) {
      //   throw new Error('Une erreur est survenue lors de l'envoi du formulaire');
      // }
      
      setSubmitSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Après 5 secondes, masquer le message de succès
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      setSubmitError(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <>
      <Header />
      <main className="bg-home">
        {/* Bannière titre */}
        <div className="bg-primary text-white py-5">
          <div className="container">
            <h1 className="fw-bold">Contactez-nous</h1>
            <p className="lead mb-0">N'hésitez pas à nous envoyer vos messages.</p>
          </div>
        </div>
        
        <div className="container py-5">
          <div className="row g-5">
            {/* Informations de contact */}
            <div className="col-lg-4">
              <h2 className="h3 mb-4">Coordonnées</h2>
              
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex mb-4">
                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div className="ms-3">
                      <h3 className="fs-5 mb-1">Siége</h3>
                      <p className="text-muted mb-0">45 Avenue Albert Camuse<br />79200 Ville</p>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-4">
                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                      <FaPhone size={20} />
                    </div>
                    <div className="ms-3">
                      <h3 className="fs-5 mb-1">Téléphone</h3>
                      <p className="text-muted mb-0">+33 6 44 24 87 11</p>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-4">
                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                      <FaEnvelope size={20} />
                    </div>
                    <div className="ms-3">
                      <h3 className="fs-5 mb-1">Email</h3>
                      <p className="text-muted mb-0">contact@nataswim.net</p>
                    </div>
                  </div>
                  
                  <div className="d-flex">
                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                      <FaClock size={20} />
                    </div>
                    <div className="ms-3">
                      <h3 className="fs-5 mb-1">Horaires</h3>
                      <p className="text-muted mb-0">
                        Lundi - Samedi : 9h00 - 18h00<br />
                        Dimanche: Fermé
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Carte (placeholder) */}
              <div className="card border-0 shadow-sm overflow-hidden">
                <div className="ratio ratio-4x3">
                  <iframe 
                    title="carte" 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1176.5239436813358!2d-0.25712794780144704!3d46.63821066641348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48076dc9d435764f%3A0xa7eaa3369cacbf3e!2sMycreanet%20DIGITAL%20SERVICES%20-%20AGENCE%20WEB%20HUMAINE%20ET%20RESPONSABLE%20-%20CONSULTANT%20E%20COMMERCE!5e0!3m2!1sfr!2sfr!4v1741162976443!5m2!1sfr!2sfr" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                  />
                </div>
              </div>
            </div>
            
            {/* Formulaire de contact */}
            <div className="col-lg-8">
              <h2 className="h3 mb-4">Envoyez-nous un message</h2>
              
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  {submitSuccess ? (
                    <div className="alert alert-success">
                      <h4 className="alert-heading">Message envoyé avec succès!</h4>
                      <p>Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {submitError && (
                        <div className="alert alert-danger mb-4">
                          {submitError}
                        </div>
                      )}
                      
                      <div className="row g-3">
                        {/* Prénom */}
                        <div className="col-md-6">
                          <label htmlFor="firstName" className="form-label">Prénom</label>
                          <input
                            type="text"
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                          {errors.firstName && (
                            <div className="invalid-feedback">
                              {errors.firstName}
                            </div>
                          )}
                        </div>
                        
                        {/* Nom */}
                        <div className="col-md-6">
                          <label htmlFor="lastName" className="form-label">Nom</label>
                          <input
                            type="text"
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                          {errors.lastName && (
                            <div className="invalid-feedback">
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                          {errors.email && (
                            <div className="invalid-feedback">
                              {errors.email}
                            </div>
                          )}
                        </div>
                        
                        {/* Téléphone */}
                        <div className="col-md-6">
                          <label htmlFor="phone" className="form-label">Téléphone (optionnel)</label>
                          <input
                            type="tel"
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                          {errors.phone && (
                            <div className="invalid-feedback">
                              {errors.phone}
                            </div>
                          )}
                        </div>
                        
                        {/* Sujet */}
                        <div className="col-12">
                          <label htmlFor="subject" className="form-label">Sujet</label>
                          <select
                            className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                          >
                            <option value="">Choisissez un sujet</option>
                            <option value="information">Demande d'information</option>
                            <option value="support">Support technique</option>
                            <option value="partnership">Partenariat</option>
                            <option value="billing">Facturation</option>
                            <option value="other">Autre</option>
                          </select>
                          {errors.subject && (
                            <div className="invalid-feedback">
                              {errors.subject}
                            </div>
                          )}
                        </div>
                        
                        {/* Message */}
                        <div className="col-12">
                          <label htmlFor="message" className="form-label">Message</label>
                          <textarea
                            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                          ></textarea>
                          {errors.message && (
                            <div className="invalid-feedback">
                              {errors.message}
                            </div>
                          )}
                        </div>
                        
                        {/* Bouton d'envoi */}
                        <div className="col-12 mt-4">
                          <button 
                            type="submit" 
                            className="btn btn-primary d-flex align-items-center"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Envoi en cours...
                              </>
                            ) : (
                              <>
                                <FaPaperPlane className="me-2" />
                                Envoyer le message
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;