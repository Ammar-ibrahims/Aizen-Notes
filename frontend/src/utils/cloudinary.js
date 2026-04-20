/**
 * Optimizes Cloudinary URLs for better browser compatibility and performance.
 * Specifically handles .heic (iPhone) conversion to browser-supported formats.
 */
export const optimizeImage = (url, width = '') => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Cloudinary transformation string: 
  // f_auto: Automatic format selection (converts HEIC to WebP/JPG)
  // q_100: Maximum quality as requested by user
  // w_{width}: Optional width resizing
  const transformation = `f_auto,q_100${width ? `,w_${width}` : ''}`;
  
  // Inject transformation after ".../upload/"
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformation}/`);
  }
  
  return url;
};
