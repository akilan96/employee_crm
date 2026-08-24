import React, { useState } from 'react';
import { X, Upload, Linkedin, Cloud, Loader2, CheckCircle2, AlertCircle, Crop, RefreshCw } from 'lucide-react';
import { BLOOD_GROUPS } from '../data/employeesData';
import { uploadToCloudinary, isCloudinaryConfigured } from '../utils/cloudinary';
import ImageCropperModal from './ImageCropperModal';
import EmployeeAvatar from './EmployeeAvatar';
import { calculateNeekanExperience } from '../utils/dateUtils';

export default function EmployeeFormModal({
  title,
  subtitle,
  initialData = {},
  onSave,
  onClose,
  onOpenCloudinaryConfig
}) {
  const [formData, setFormData] = useState({
    id: initialData.id === 'Not Provided' ? '' : (initialData.id || ''),
    isIdNotProvided: initialData.id === 'Not Provided' || initialData.isIdNotProvided || false,
    name: initialData.name || '',
    email: initialData.email || '',
    companyName: initialData.companyName || 'Neekan Consulting LLP',
    mobile: initialData.mobile || '',
    linkedin: initialData.linkedin || '',
    bloodGroup: initialData.bloodGroup || 'O+',
    address: initialData.address || '',
    department: initialData.department || 'Software Engineer',
    role: initialData.role || '',
    overallExp: initialData.overallExp !== undefined ? initialData.overallExp : (initialData.experience ? parseFloat(initialData.experience) || 3.0 : 3.0),
    joiningDate: initialData.joiningDate || new Date().toISOString().split('T')[0],
    neekanExp: initialData.neekanExp !== undefined ? initialData.neekanExp : 1.5,
    pic: initialData.pic || '',
    status: initialData.status || 'Active',
    skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : (initialData.skills || '')
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null); // { type: 'success'|'info'|'error', text: string }

  // Image Cropper Modal State
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [pendingCropSrc, setPendingCropSrc] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // When user selects an image file, open cropper modal
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingCropSrc(event.target.result);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  // Upload the cropped image
  const handleCropComplete = async (croppedFile, croppedDataUrl) => {
    setIsCropperOpen(false);
    setPendingCropSrc(null);

    // 1. Immediately apply the image so the avatar preview updates right away
    const initialUrl = croppedDataUrl || '';
    handleInputChange('pic', initialUrl);

    // 2. If Cloudinary is configured and file exists, upload to CDN
    if (croppedFile && isCloudinaryConfigured()) {
      setIsUploading(true);
      setUploadMessage({ type: 'info', text: 'Uploading photo to Cloudinary CDN...' });

      try {
        const result = await uploadToCloudinary(croppedFile);
        setIsUploading(false);

        if (result.success && result.url) {
          handleInputChange('pic', result.url);
          setUploadMessage({
            type: 'success',
            text: '✓ Photo saved & hosted on Cloudinary CDN!'
          });
        } else {
          setUploadMessage({
            type: 'info',
            text: '✓ Photo applied.'
          });
        }
      } catch (err) {
        setIsUploading(false);
        setUploadMessage({
          type: 'info',
          text: '✓ Photo applied.'
        });
      }
    } else {
      setUploadMessage({
        type: 'success',
        text: '✓ Photo applied.'
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Invalid email format";
    }
    if (!formData.mobile.trim()) errs.mobile = "Mobile number is required";
    if (!formData.companyName.trim()) errs.companyName = "Company name is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.bloodGroup) errs.bloodGroup = "Blood group is required";
    if (!formData.department) errs.department = "Department is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const overallNum = parseFloat(formData.overallExp) || 0;
      const computed = calculateNeekanExperience(formData.joiningDate);
      const finalId = formData.isIdNotProvided
        ? 'Not Provided'
        : (formData.id?.trim() || initialData.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`);

      onSave({
        ...initialData,
        ...formData,
        id: finalId,
        isIdNotProvided: formData.isIdNotProvided || finalId === 'Not Provided',
        overallExp: overallNum,
        neekanExp: computed.years,
        joiningDate: formData.joiningDate,
        experience: `${overallNum} Yrs`
      });
    }
  };

  const isCloudinaryUrl = formData.pic?.includes('cloudinary.com');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm modal-animate overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Avatar Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Profile Picture
              </label>
              {isCloudinaryUrl ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <Cloud className="w-3 h-3" />
                  <span>Cloudinary CDN</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onOpenCloudinaryConfig}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Cloud className="w-3 h-3" />
                  <span>{isCloudinaryConfigured() ? 'Cloudinary Ready' : 'Configure Cloudinary'}</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <EmployeeAvatar
                  src={formData.pic}
                  name={formData.name || 'New Employee'}
                  size="xl"
                  rounded="rounded-3xl"
                  className="w-24 h-24 ring-2 ring-indigo-500 shadow-md shrink-0"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-3xl backdrop-blur-xs flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    <span className="text-[10px] font-bold mt-1">Uploading</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.pic}
                    onChange={(e) => handleInputChange('pic', e.target.value)}
                    placeholder="Enter image URL or upload photo..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <label className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white cursor-pointer shadow-sm shrink-0 flex items-center gap-1.5 active:scale-95 transition-all">
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : formData.pic ? (
                      <RefreshCw className="w-3.5 h-3.5" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{isUploading ? 'Uploading...' : formData.pic ? 'Change New' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadMessage && (
                  <p className={`text-[11px] font-medium flex items-center gap-1 ${
                    uploadMessage.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                    uploadMessage.type === 'error' ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {uploadMessage.type === 'success' && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                    {uploadMessage.type === 'error' && <AlertCircle className="w-3 h-3 shrink-0" />}
                    <span>{uploadMessage.text}</span>
                  </p>
                )}

                {/* Photo helper & remove action */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span className="truncate">
                    {formData.pic ? '✓ Custom photo attached' : '💡 No photo uploaded — Smart name initials will be displayed'}
                  </span>
                  {formData.pic && (
                    <button
                      type="button"
                      onClick={() => handleInputChange('pic', '')}
                      className="text-rose-500 hover:text-rose-600 font-semibold hover:underline shrink-0 ml-2"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Department (4 Sections Required) & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Department Section <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border ${
                  errors.department ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="Software Engineer">💻 Software Engineer</option>
                <option value="UI/UX">🎨 UI/UX Designer</option>
                <option value="DBA">🗄️ DBA (Database Administrator)</option>
                <option value="Management">👔 Management & Leadership</option>
              </select>
              {errors.department && <p className="text-[11px] text-rose-500 mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Designation / Job Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="e.g. Senior Full Stack Architect"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Overall Experience & Neekan Date of Joining */}
          {(() => {
            const computedNeekan = calculateNeekanExperience(formData.joiningDate);
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Overall Experience (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="50"
                    value={formData.overallExp}
                    onChange={(e) => handleInputChange('overallExp', e.target.value)}
                    placeholder="e.g. 5.5"
                    className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Total industry career experience</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
                      Date of Joining at Neekan <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      computedNeekan.isLessThanYear
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                    }`}>
                      {computedNeekan.badge}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono font-semibold rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className={`text-[10px] font-medium mt-1 block truncate ${
                    computedNeekan.isLessThanYear ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-indigo-500/90 dark:text-indigo-400/90'
                  }`}>
                    {computedNeekan.isLessThanYear ? '⚡ Less than 1 year: ' : '✨ Neekan Tenure: '} {computedNeekan.formatted}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Full Name & Employee ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Employee ID
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isIdNotProvided}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData(prev => ({
                        ...prev,
                        isIdNotProvided: checked,
                        id: checked ? '' : prev.id
                      }));
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    Not Provided
                  </span>
                </label>
              </div>
              <input
                type="text"
                disabled={formData.isIdNotProvided}
                value={formData.isIdNotProvided ? 'Not Provided' : formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                placeholder="e.g. EMP-1009 (or leave blank for auto)"
                className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border ${
                  formData.isIdNotProvided 
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold cursor-not-allowed' 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                } focus:ring-2 focus:ring-indigo-500`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {formData.isIdNotProvided ? '⚠️ Marked as ID Not Provided' : 'Enter custom ID or leave blank to auto-generate'}
              </span>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Neekan Consulting LLP"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                errors.companyName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.companyName && <p className="text-[11px] text-rose-500 mt-1">{errors.companyName}</p>}
          </div>

          {/* Email, Mobile & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="name@neekanconsulting.com"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border ${
                  errors.mobile ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.mobile && <p className="text-[11px] text-rose-500 mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Blood Group <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-indigo-500 font-mono"
              >
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              LinkedIn Profile URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0a66c2]">
                <Linkedin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="https://www.linkedin.com/in/username"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Residential Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="2"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Flat / House No, Street, City, State, Postal Code"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                errors.address ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500`}
            ></textarea>
            {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
          </div>

          {/* Status & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Employment Status
              </label>
              <select
                value={formData.status === 'Inactive' || formData.status === 'In Active' ? 'Inactive' : 'Active'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">In Active</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Skills / Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="React, Figma, PostgreSQL, Management"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
            >
              Save Employee Profile
            </button>
          </div>
        </form>
      </div>

      {/* Embedded Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={pendingCropSrc}
        onClose={() => {
          setIsCropperOpen(false);
          setPendingCropSrc(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
