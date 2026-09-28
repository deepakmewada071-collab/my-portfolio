import { useState, useEffect } from 'react';

const STORAGE_KEY = 'deepak_portfolio_avatar_photo';

export const useProfileAvatar = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch {
      // ignore
    }
    return '/deepak-photo.svg';
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setAvatarUrl(stored);
      } catch {
        // ignore
      }
    };

    window.addEventListener('deepak_avatar_updated', handleStorageChange);
    return () => window.removeEventListener('deepak_avatar_updated', handleStorageChange);
  }, []);

  const updateAvatar = async (file: File): Promise<string> => {
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
          // Save to localStorage immediately for instant UI responsiveness
          localStorage.setItem(STORAGE_KEY, base64);
          setAvatarUrl(base64);
          window.dispatchEvent(new Event('deepak_avatar_updated'));

          // Also persist to server public directory
          await fetch('/api/upload-avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64 }),
          }).catch((err) => console.warn('Server avatar save skipped:', err));

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

  const resetAvatar = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setAvatarUrl('/deepak-photo.jpg');
      window.dispatchEvent(new Event('deepak_avatar_updated'));
    } catch {
      // ignore
    }
  };

  return {
    avatarUrl,
    isUploading,
    updateAvatar,
    resetAvatar,
  };
};
