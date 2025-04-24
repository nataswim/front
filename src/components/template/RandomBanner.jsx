import React, { useState, useEffect } from 'react';
import '../../assets/styles/user-layout.css'; 

const RandomBanner = () => {
  const [currentBanner, setCurrentBanner] = useState('');
  const [key, setKey] = useState(0);

  const bannerDir = '/assets/images/banner/';
  const bannerCount = 5;
  const bannerExtension = '.jpg';
  const bannerPrefix = 'nataswim_app_banner_';

  const selectRandomBanner = () => {
    const randomNumber = Math.floor(Math.random() * bannerCount) + 1;
    const bannerPath = `${bannerDir}${bannerPrefix}${randomNumber}${bannerExtension}`;
    setCurrentBanner(bannerPath);
    setKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    const handleUrlChange = () => {
      selectRandomBanner();
    };

    selectRandomBanner();

    window.addEventListener('popstate', handleUrlChange);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          handleUrlChange();
        }
      });
    });

    observer.observe(document.querySelector('title') || document.head, {
      childList: true,
      subtree: true
    });

    const handleLinkClick = () => {
      setTimeout(handleUrlChange, 100);
    };

    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        handleLinkClick();
      }
    });

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      observer.disconnect();
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  return (
    <div className="banner-container-outer">
        <div className="banner-wrapper">
          <img
            key={key}
            src={currentBanner}
            alt="Bannière du site"
            className="banner-image"
            onError={(e) => {
              console.warn('Erreur de chargement de la bannière:', e);
              e.target.src = `${bannerDir}${bannerPrefix}1${bannerExtension}`;
            }}
          />
        </div>
    </div>
  );
};

export default RandomBanner;