export const SUPPORTED_TYPES = {
  pdf: ['application/pdf'],
  docx: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'],
  text: ['text/plain'],
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function getFileType(mimeType: string): 'pdf' | 'docx' | 'image' | 'text' | 'unknown' {
  if (SUPPORTED_TYPES.pdf.includes(mimeType)) return 'pdf';
  if (SUPPORTED_TYPES.docx.includes(mimeType)) return 'docx';
  if (SUPPORTED_TYPES.image.includes(mimeType)) return 'image';
  if (SUPPORTED_TYPES.text.includes(mimeType)) return 'text';
  return 'unknown';
}

export function isFileSupported(mimeType: string): boolean {
  return getFileType(mimeType) !== 'unknown';
}

export function getFileIcon(mimeType: string): string {
  const type = getFileType(mimeType);
  const icons: Record<string, string> = {
    pdf: '📄',
    docx: '📝',
    image: '🖼️',
    text: '📋',
    unknown: '📦',
  };
  return icons[type];
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
