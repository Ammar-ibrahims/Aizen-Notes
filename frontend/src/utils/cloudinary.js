export const optimizeImage = (url, width = '') => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Only apply aggressive transformations to HEIC (iPhone) files or if explicitly requested
  // This prevents breaking standard images that were already working.
  const isHeic = url.toLowerCase().endsWith('.heic');
  
  if (!isHeic && !width) return url;

  const transformation = `f_auto,q_100${width ? `,w_${width}` : ''}`;
  
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformation}/`);
  }
  
  return url;
};
