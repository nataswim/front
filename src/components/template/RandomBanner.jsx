import React, { useState, useEffect, useCallback } from 'react';
import '../../assets/styles/user-layout.css'; 

const RandomBanner = () => {
  const [currentBanner, setCurrentBanner] = useState('');
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const bannerDir = '/assets/images/banner/';
  const bannerCount = 5;
  const bannerExtension = '.jpg';
  const bannerPrefix = 'nataswim_app_banner_';

  const selectRandomBanner = useCallback(() => {
    const randomNumber = Math.floor(Math.random() * bannerCount) + 1;
    const bannerPath = `${bannerDir}${bannerPrefix}${randomNumber}${bannerExtension}`;
    setCurrentBanner(bannerPath);
    setKey(prevKey => prevKey + 1);
    setIsLoading(true);
  }, [bannerDir, bannerPrefix, bannerExtension, bannerCount]);

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
  }, [selectRandomBanner]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = (e) => {
    console.warn('Erreur de chargement de la bannière:', e);
    setError('Impossible de charger la bannière');
    setIsLoading(false);
    e.target.src = `${bannerDir}${bannerPrefix}1${bannerExtension}`;
  };

  return (
    <div className="banner-container-outer" role="banner" aria-label="Bannière décorative">
      <div className="banner-wrapper">
        {isLoading && (
          <div className="banner-loading" aria-hidden="true">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement de la bannière...</span>
            </div>
          </div>
        )}
        <img
          key={key}
          src={currentBanner}
          alt=""
          className="banner-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: isLoading ? 0 : 1 }}
        />
        {error && <div className="banner-error" aria-live="polite">{error}</div>}
      </div>
    </div>
  );
};

export default React.memo(RandomBanner);