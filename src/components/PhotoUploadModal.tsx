import React, { useState, useRef } from 'react';
import { X, Upload, Camera, CheckCircle2, Image as ImageIcon, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useProfileAvatar } from '../utils/useProfileAvatar';
import { useBackgroundPhoto } from '../utils/useBackgroundPhoto';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'avatar' | 'background';
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'avatar',
}) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'background'>(initialTab);
  const { avatarUrl, isUploading: isUploadingAvatar, updateAvatar, resetAvatar } = useProfileAvatar();
  const { bgUrl, isUploading: isUploadingBg, updateBackground, resetBackground } = useBackgroundPhoto();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleTabSwitch = (tab: 'avatar' | 'background') => {
    setActiveTab(tab);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleApply = async () => {
    if (!selectedFile) return;

    try {
      if (activeTab === 'avatar') {
        await updateAvatar(selectedFile);
      } else {
        await updateBackground(selectedFile);
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to update photo:', err);
    }
  };

  const handleReset = () => {
    if (activeTab === 'avatar') {
      resetAvatar();
    } else {
      resetBackground();
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const isUploading = activeTab === 'avatar' ? isUploadingAvatar : isUploadingBg;
  const currentPhoto = activeTab === 'avatar' ? avatarUrl : bgUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#0e0e11] border border-white/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-modal-title"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#ff2a2a]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ff2a2a]/15 border border-[#ff2a2a]/30 text-[#ff2a2a]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 id="photo-modal-title" className="text-base font-bold text-white font-display">
                Update Portfolio Photos
              </h3>
              <p className="text-xs text-zinc-400">Deepak's verified photo assets</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close photo dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Avatar vs Background */}
        <div className="pt-4 flex rounded-xl bg-white/5 p-1 border border-white/10 relative z-10">
          <button
            type="button"
            onClick={() => handleTabSwitch('avatar')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'avatar'
                ? 'bg-[#ff2a2a] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Profile Photo</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('background')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'background'
                ? 'bg-[#ff2a2a] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hero Background Photo</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Choose photo file"
        />

        {/* Modal Body */}
        <div className="py-5 space-y-4 relative z-10">
          {/* Preview Area */}
          <div className="flex flex-col items-center justify-center">
            {activeTab === 'avatar' ? (
              /* Circular Avatar Preview */
              <div className="relative group">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#ff2a2a] via-[#ff6b4a] to-emerald-500 shadow-xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 border-2 border-[#0e0e11] flex items-center justify-center">
                    <img
                      src={previewUrl || avatarUrl}
                      alt="Deepak Mewada"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/deepak-photo.svg';
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[#ff2a2a] hover:bg-[#e40014] text-white border-2 border-[#0e0e11] shadow-lg cursor-pointer transition-transform hover:scale-110"
                  title="Choose new profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Landscape Background Preview */
              <div className="w-full h-40 rounded-2xl overflow-hidden border-2 border-white/15 relative group bg-zinc-900 shadow-xl">
                <img
                  src={previewUrl || bgUrl}
                  alt="Deepak Background"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/deepak-bg.svg';
                  }}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-full bg-[#ff2a2a] hover:bg-[#e40014] text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg cursor-pointer transition-transform hover:scale-105"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Background Image</span>
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-zinc-400 mt-2.5 text-center">
              {activeTab === 'avatar'
                ? previewUrl
                  ? 'Previewing selected profile photo. Click "Save & Apply".'
                  : 'Profile Photo (Yellow striped shirt at night park)'
                : previewUrl
                ? 'Previewing selected background image. Click "Save & Apply".'
                : 'Hero Background Photo (Deepak standing at Bhopal Plaza entrance)'}
            </p>
          </div>

          {/* Quick info note */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 font-semibold text-white mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ff2a2a]" />
              <span>
                {activeTab === 'avatar' ? 'Recommended File' : 'Background Photo'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {activeTab === 'avatar'
                ? 'Select "WhatsApp Image 2026-09-29 at 12.34.47 AM.jpeg" for your portrait avatar.'
                : 'Select "WhatsApp Image 2026-09-29 at 12.34.48 AM.jpeg" to display your real photo across the Hero background.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-1">
            {!previewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#ff2a2a] hover:bg-[#e40014] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>
                  {activeTab === 'avatar'
                    ? 'Select Profile Photo from Device'
                    : 'Select Background Photo from Device'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Choose Different
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={isUploading}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#ff2a2a] hover:bg-[#e40014] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/40 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{isUploading ? 'Saving...' : 'Save & Apply'}</span>
                </button>
              </div>
            )}

            {currentPhoto.startsWith('data:') && (
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-1.5 text-center text-xs text-zinc-500 hover:text-zinc-400 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to default artwork</span>
              </button>
            )}

            {isSuccess && (
              <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Photo successfully updated!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
