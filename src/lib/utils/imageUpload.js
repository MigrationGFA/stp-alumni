/**
 * Utility functions for image upload handling
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGES = 4;

/**
 * Validate an image file
 * @param {File} file 
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateImage = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit.',
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate multiple images
 * @param {File[]} files 
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateImages = (files) => {
  if (!files || files.length === 0) {
    return { valid: true, error: null }; // No images is valid
  }

  if (files.length > MAX_IMAGES) {
    return {
      valid: false,
      error: `Maximum ${MAX_IMAGES} images allowed per post.`,
    };
  }

  for (const file of files) {
    const validation = validateImage(file);
    if (!validation.valid) {
      return validation;
    }
  }

  return { valid: true, error: null };
};

/**
 * Create a preview URL for an image file
 * @param {File} file 
 * @returns {string} Preview URL
 */
export const createPreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Create preview URLs for multiple files
 * @param {File[]} files 
 * @returns {string[]} Array of preview URLs
 */
export const createPreviews = (files) => {
  return files.map((file) => createPreview(file));
};

/**
 * Revoke a preview URL to free memory
 * @param {string} url 
 */
export const revokePreview = (url) => {
  URL.revokeObjectURL(url);
};

/**
 * Revoke multiple preview URLs
 * @param {string[]} urls 
 */
export const revokePreviews = (urls) => {
  urls.forEach((url) => revokePreview(url));
};

/**
 * Compress an image (basic implementation)
 * For production, consider using a library like browser-image-compression
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} quality 
 * @returns {Promise<File>}
 */
export const compressImage = async (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

/**
 * Prepare FormData for post creation
 * @param {string} body - Post text content
 * @param {File[]} images - Array of image files
 * @returns {FormData}
 */
export const preparePostFormData = (body, images = []) => {
  const formData = new FormData();
  formData.append('body', body);

  images.forEach((image, index) => {
    formData.append(`postImage[${index}]`, image);
  });

  return formData;
};

/**
 * Format file size for display
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
