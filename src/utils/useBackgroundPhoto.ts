import { useState, useEffect } from 'react';

const STORAGE_KEY = 'deepak_portfolio_bg_photo';

export const useBackgroundPhoto = () => {
  const [bgUrl, setBgUrl] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch {
      // ignore
    }
    return '/deepak-bg.svg';
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setBgUrl(stored);
      } catch {
        // ignore
      }
    };

    window.addEventListener('deepak_bg_updated', handleStorageChange);
    return () => window.removeEventListener('deepak_bg_updated', handleStorageChange);
  }, []);

  const updateBackground = async (file: File): Promise<string> => {
    setIsUploading(true);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        if (!base64) {
          setIsUploading(false);
          return reject(new Error('Failed to read image file'));
        }

        try {
          localStorage.setItem(STORAGE_KEY, base64);
          setBgUrl(base64);
          window.dispatchEvent(new Event('deepak_bg_updated'));

          // Post to backend
          await fetch('/api/upload-background', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64 }),
          }).catch((err) => console.warn('Server background save skipped:', err));

          setIsUploading(false);
          resolve(base64);
        } catch (err) {
          setIsUploading(false);
          reject(err);
        }
      };
      reader.onerror = (err) => {
        setIsUploading(false);
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  const resetBackground = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setBgUrl('/deepak-bg.svg');
      window.dispatchEvent(new Event('deepak_bg_updated'));
    } catch {
      // ignore
    }
  };

  return {
    bgUrl,
    isUploading,
    updateBackground,
    resetBackground,
  };
};
