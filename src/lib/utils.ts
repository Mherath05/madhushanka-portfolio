import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts Google Drive share links into direct image CDN links
 * Example input: https://drive.google.com/file/d/1A2B3C4D5E6F/view?usp=sharing
 * Output: https://lh3.googleusercontent.com/d/1A2B3C4D5E6F
 */
export function formatImageUrl(url: string): string {
  if (!url) return url;

  // Match /file/d/FILE_ID or id=FILE_ID
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);

  if (fileIdMatch && fileIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
  }

  return url;
}

/**
 * Extracts YouTube Video ID from various YouTube URL formats
 */
export function getYoutubeVideoId(url?: string | null): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Returns embed URL for iframe
 */
export function getYoutubeEmbedUrl(url?: string | null): string | null {
  const id = getYoutubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/**
 * Returns YouTube thumbnail URL
 */
export function getYoutubeThumbnailUrl(url?: string | null): string | null {
  const id = getYoutubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
