/**
 * Upload a file to Cloudinary (direct browser upload)
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<string>} Secure URL of uploaded file
 */
export async function uploadToCloudinary(file, folder = 'ccrs_reports') {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ccrs_unsigned');
  formData.append('folder', folder);
  formData.append('tags', 'crisis_report');

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Delete a file from Cloudinary (requires server-side signature)
 * This is a placeholder - actual deletion should be done server-side
 * @param {string} publicId - The public_id of the file to delete
 */
export async function deleteFromCloudinary(publicId) {
  console.warn('Deletion requires server-side implementation. Public ID:', publicId);
}
