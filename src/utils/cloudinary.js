// Cloudinary Client-Side Upload Utility for Neekan Consulting CRM

export const getCloudinaryConfig = () => {
  // Check localStorage first (user runtime config), then environment variables
  const localConfig = localStorage.getItem('neekan_cloudinary_config');
  if (localConfig) {
    try {
      const parsed = JSON.parse(localConfig);
      if (parsed.cloudName && parsed.uploadPreset) {
        return {
          cloudName: parsed.cloudName.trim(),
          uploadPreset: parsed.uploadPreset.trim(),
          folder: (parsed.folder || 'neekan_emp').trim(),
          source: 'localStorage'
        };
      }
    } catch (e) {
      console.error('Error parsing stored Cloudinary config', e);
    }
  }

  // Fallback to Vite env variables (Vercel deployment) or user default
  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'xp0artkw';
  const envUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
  const envFolder = import.meta.env.VITE_CLOUDINARY_FOLDER || 'neekan_emp';

  if (envCloudName && envUploadPreset) {
    return {
      cloudName: envCloudName.trim(),
      uploadPreset: envUploadPreset.trim(),
      folder: envFolder.trim(),
      source: 'env'
    };
  }

  return {
    cloudName: 'xp0artkw',
    uploadPreset: 'ml_default',
    folder: 'neekan_emp',
    source: 'default'
  };
};

export const isCloudinaryConfigured = () => {
  const config = getCloudinaryConfig();
  return Boolean(config.cloudName && config.uploadPreset);
};

export const saveCloudinaryConfig = (config) => {
  if (!config) {
    localStorage.removeItem('neekan_cloudinary_config');
    return;
  }
  localStorage.setItem('neekan_cloudinary_config', JSON.stringify({
    cloudName: config.cloudName?.trim() || '',
    uploadPreset: config.uploadPreset?.trim() || '',
    folder: config.folder?.trim() || 'neekan_employees'
  }));
};

/**
 * Upload an image file directly to Cloudinary using unsigned upload preset
 * @param {File|Blob|string} file - File object, Blob, or base64 data URL
 * @param {Function} onProgress - Optional upload progress callback
 * @returns {Promise<{success: boolean, url?: string, publicId?: string, error?: string}>}
 */
export const uploadToCloudinary = async (file, onProgress) => {
  const config = getCloudinaryConfig();
  if (!config.cloudName || !config.uploadPreset) {
    return {
      success: false,
      error: 'Cloudinary is not configured. Please set your Cloud Name and Upload Preset in settings or Vercel environment variables.'
    };
  }

  const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);
  const uniquePublicId = `emp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  formData.append('public_id', uniquePublicId);
  if (config.folder) {
    formData.append('folder', config.folder);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || `Cloudinary upload failed with status ${response.status}`;
      return { success: false, error: errorMsg };
    }

    return {
      success: true,
      url: data.secure_url || data.url,
      publicId: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Network error while connecting to Cloudinary'
    };
  }
};
