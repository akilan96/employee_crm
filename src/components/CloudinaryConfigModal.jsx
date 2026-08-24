import React, { useState, useEffect } from 'react';
import { Cloud, X, CheckCircle2, AlertCircle, ExternalLink, Key, Folder, Sparkles, HelpCircle } from 'lucide-react';
import { getCloudinaryConfig, saveCloudinaryConfig, uploadToCloudinary } from '../utils/cloudinary';

export default function CloudinaryConfigModal({
  isOpen,
  onClose,
  onConfigSaved
}) {
  const [cloudName, setCloudName] = useState('');
  const [uploadPreset, setUploadPreset] = useState('');
  const [folder, setFolder] = useState('neekan_emp');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { status: 'success'|'error', message: string }
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'guide'

  useEffect(() => {
    if (isOpen) {
      const config = getCloudinaryConfig();
      setCloudName(config.cloudName || '');
      setUploadPreset(config.uploadPreset || '');
      setFolder(config.folder || 'neekan_emp');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!cloudName.trim() || !uploadPreset.trim()) {
      setTestResult({
        status: 'error',
        message: 'Please enter both Cloud Name and Upload Preset.'
      });
      return;
    }

    saveCloudinaryConfig({
      cloudName,
      uploadPreset,
      folder
    });

    if (onConfigSaved) {
      onConfigSaved('Cloudinary configuration saved successfully!');
    }
    onClose();
  };

  const handleClear = () => {
    saveCloudinaryConfig(null);
    setCloudName('');
    setUploadPreset('');
    setFolder('neekan_employees');
    setTestResult({
      status: 'info',
      message: 'Cloudinary configuration cleared. The app will use local storage for photos.'
    });
    if (onConfigSaved) {
      onConfigSaved('Cloudinary configuration cleared.');
    }
  };

  const handleTestConnection = async () => {
    if (!cloudName.trim() || !uploadPreset.trim()) {
      setTestResult({
        status: 'error',
        message: 'Please enter Cloud Name and Upload Preset before testing.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    // Temporarily save to test
    saveCloudinaryConfig({ cloudName, uploadPreset, folder });

    // 1x1 transparent PNG pixel for test ping
    const testPixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const res = await uploadToCloudinary(testPixel);
    setIsTesting(false);

    if (res.success) {
      setTestResult({
        status: 'success',
        message: `Connected successfully! Test image uploaded to Cloudinary CDN.`
      });
    } else {
      setTestResult({
        status: 'error',
        message: res.error || 'Connection failed. Check your Cloud Name & Unsigned Preset.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm modal-animate overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Cloudinary Cloud Storage</h2>
              <p className="text-xs text-blue-100">Permanent global CDN photo hosting for Vercel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-6 pt-3">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Credentials & Settings
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Setup Guide (3 Steps)</span>
          </button>
        </div>

        {/* Form Body */}
        {activeTab === 'settings' ? (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Cloudinary Cloud Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cloudName}
                  onChange={(e) => setCloudName(e.target.value)}
                  placeholder="e.g. dk9v4x2ab"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Found on your Cloudinary dashboard main screen.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Unsigned Upload Preset <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={uploadPreset}
                  onChange={(e) => setUploadPreset(e.target.value)}
                  placeholder="e.g. neekan_employee_photos"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Must be an <strong>Unsigned</strong> preset created in Cloudinary Settings.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Folder Name (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  placeholder="neekan_employees"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Photos will be organized in this folder inside Cloudinary media library.
              </p>
            </div>

            {/* Test result alert */}
            {testResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                testResult.status === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : testResult.status === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  : 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              }`}>
                {testResult.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : testResult.status === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">{testResult.message}</div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>
                {cloudName && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                >
                  Save Config
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4 text-xs text-slate-600 dark:text-slate-300 max-h-[60vh] overflow-y-auto">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
              <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-200 mb-1">
                How to set up Free Cloudinary Unsigned Upload
              </h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-300">
                Direct browser uploads without backend servers (100% free tier includes 25GB/month).
              </p>
            </div>

            <ol className="space-y-3 list-decimal list-inside font-medium">
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <strong className="text-slate-900 dark:text-white">Create a free Cloudinary Account:</strong>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Go to <a href="https://cloudinary.com/users/register_free" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-0.5">cloudinary.com <ExternalLink className="w-2.5 h-2.5" /></a> and sign up. Note down your <strong>Cloud Name</strong> from the dashboard.
                </p>
              </li>

              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <strong className="text-slate-900 dark:text-white">Enable an Unsigned Upload Preset:</strong>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Click the ⚙️ <strong>Settings gear icon</strong> (bottom left) → Click <strong>Upload</strong> tab → Scroll down to <strong>Upload presets</strong> → Click <strong>Add upload preset</strong>.
                </p>
                <div className="mt-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px]">
                  ✓ Important: Change <strong>Signing Mode</strong> from <em>Signed</em> to <strong>Unsigned</strong>. Save and copy the preset name.
                </div>
              </li>

              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <strong className="text-slate-900 dark:text-white">Set Vercel Environment Variables:</strong>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  When deploying to Vercel, in your Project Settings → <strong>Environment Variables</strong>:
                </p>
                <code className="block mt-2 p-2 rounded bg-slate-900 text-slate-100 font-mono text-[11px]">
                  VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name<br/>
                  VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
                </code>
              </li>
            </ol>

            <button
              onClick={() => setActiveTab('settings')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Enter Credentials Now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
