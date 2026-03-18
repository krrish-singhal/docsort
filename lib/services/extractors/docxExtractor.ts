import { ExtractionResult } from '@/lib/types';

export async function extractTextFromDOCX(buffer: Buffer): Promise<ExtractionResult> {
  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    
    return {
      text: result.value,
      extractedFrom: 'text',
    };
  } catch (error) {
    console.error('[v0] Error extracting DOCX:', error);
    throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
