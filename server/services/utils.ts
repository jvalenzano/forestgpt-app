/**
 * Sleep for the specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Format file size in KB
 */
export function formatFileSize(bytes: number): string {
  return (bytes / 1024).toFixed(1) + ' KB';
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    const domain = new URL(url).hostname;
    return domain;
  } catch (error) {
    return url;
  }
}

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
