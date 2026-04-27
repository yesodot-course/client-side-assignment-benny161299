const SERVER_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface ImgbbResult {
  url: string;
  deleteUrl: string;
}

/**
 * Uploads a File to imgbb via our own backend proxy.
 * The imgbb API key never leaves the server.
 *
 * Flow: File → base64 → POST /api/upload → server calls imgbb → URL returned
 */
export async function uploadToImgbb(file: File): Promise<ImgbbResult> {
  // Convert file to base64 (without the data:...;base64, prefix)
  const base64 = await fileToBase64(file);

  const res = await fetch(`${SERVER_URL}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({ message: res.statusText })) as { message?: string };
    throw new Error(json.message ?? `Upload failed (${res.status})`);
  }

  const json = (await res.json()) as { data: { url: string; deleteUrl: string } };
  return { url: json.data.url, deleteUrl: json.data.deleteUrl };
}

/** Reads a File and returns its raw base64 content (no data-URI prefix). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = () => reject(new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });
}
