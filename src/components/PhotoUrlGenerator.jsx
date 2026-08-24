import React, { useState } from 'react';
import { Upload, Copy, Check, CheckCircle2, AlertCircle, RefreshCw, Image as ImageIcon, Sparkles, UserCheck, Crop } from 'lucide-react';
import { uploadToCloudinary, getCloudinaryConfig } from '../utils/cloudinary';
import ImageCropperModal from './ImageCropperModal';

export default function PhotoUrlGenerator({
  employees,
  onUpdateEmployeePhoto,
  onShowToast
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [copied, setCopied] = useState(false);

  // Cropper Modal state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [pendingImageSrc, setPendingImageSrc] = useState(null);

  const config = getCloudinaryConfig();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openCropper(file);
    e.target.value = ''; // Reset input
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      openCropper(file);
    }
  };

  const openCropper = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImageSrc(event.target.result);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile) => {
    setIsCropperOpen(false);
    setPendingImageSrc(null);
    await uploadFile(croppedFile);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadError(null);

    const res = await uploadToCloudinary(file);
    setIsUploading(false);

    if (res.success && res.url) {
      setUploadedUrl(res.url);
      if (onShowToast) {
        onShowToast('✓ Cropped photo uploaded to Cloudinary!', 'success');
      }
    } else {
      setUploadError(res.error || 'Upload failed. Check Cloudinary settings.');
    }
  };

  const handleCopy = () => {
    if (!uploadedUrl) return;
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    if (onShowToast) {
      onShowToast('✓ URL copied to clipboard!', 'success');
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAssign = () => {
    if (!selectedEmployeeId || !uploadedUrl) return;
    const emp = employees.find(e => e.id === selectedEmployeeId);
    if (emp && onUpdateEmployeePhoto) {
      onUpdateEmployeePhoto(selectedEmployeeId, uploadedUrl);
      if (onShowToast) {
        onShowToast(`✓ Photo updated for ${emp.name}!`, 'success');
      }
    }
  };

  const handleReset = () => {
    setUploadedUrl('');
    setSelectedEmployeeId('');
    setUploadError(null);
  };

  return (
    <div className="max-w-xl mx-auto py-4 animate-fadeIn">
      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={pendingImageSrc}
        onClose={() => {
          setIsCropperOpen(false);
          setPendingImageSrc(null);
        }}
        onCropComplete={handleCropComplete}
      />

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Simple Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Photo URL Generator
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Cloud: {config.cloudName || 'xp0artkw'}
              </span>
            </div>
          </div>

          {uploadedUrl && (
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Upload Another
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {!uploadedUrl ? (
            /* Upload Zone */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[240px] ${
                isUploading
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                {isUploading ? (
                  <RefreshCw className="w-7 h-7 animate-spin" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {isUploading ? 'Uploading Cropped Photo to Cloudinary...' : 'Upload & Crop Employee Photo'}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Drag & drop image file here or click browse to crop & upload
              </p>

              <label className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md flex items-center gap-1.5 transition-all">
                <Crop className="w-4 h-4" />
                <span>Select & Crop Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          ) : (
            /* Uploaded Result View */
            <div className="space-y-5">
              {/* Photo Preview + URL */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <img
                  src={uploadedUrl}
                  alt="Uploaded"
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md shrink-0"
                />

                <div className="flex-1 w-full space-y-2 min-w-0">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Generated Cloudinary URL:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={uploadedUrl}
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Assign to Employee */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Assign to Employee:</span>
                </span>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Choose Employee --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.id})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleAssign}
                    disabled={!selectedEmployeeId}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Assign Photo</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
