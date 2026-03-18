# Document Organizer - AI-Powered File Classification System

An intelligent document management system that automatically classifies and organizes documents using hybrid AI classification (rule-based + Groq LLM).

## Features

- **Drag & Drop Upload**: Easy file upload with visual feedback
- **Multi-Format Support**: PDF, DOCX, images (JPEG, PNG, WebP, TIFF), and text files
- **Intelligent Classification**: Hybrid approach using:
  - Rule-based classification for instant high-confidence categorization
  - Groq AI for uncertain cases or additional accuracy
- **8 Document Categories**:
  - Invoices
  - Finance Documents
  - Medical Reports
  - Legal Documents
  - Academic Papers
  - Receipts
  - Personal Documents
  - Others

- **Real-Time Processing**: Live progress tracking and extraction feedback
- **Confidence Scoring**: See classification confidence levels
- **Automatic Organization**: Files automatically organized into category folders

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Groq API Key (free at https://console.groq.com)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd document-organizer
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Groq API key to `.env.local`:
```
GROQ_API_KEY=your_api_key_here
```

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   └── api/
│       └── upload/
│           └── route.ts      # Upload API endpoint
├── components/
│   ├── UploadZone.tsx        # Main drag-drop component
│   └── UploadResults.tsx     # Results display
├── lib/
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   ├── services/
│   │   ├── extractors/       # Text extraction services
│   │   │   ├── pdfExtractor.ts
│   │   │   ├── docxExtractor.ts
│   │   │   └── index.ts
│   │   ├── classifier/       # Classification services
│   │   │   ├── ruleClassifier.ts
│   │   │   ├── aiClassifier.ts
│   │   │   └── index.ts
│   │   └── fileManager.ts    # File organization
│   └── utils/
│       └── fileUtils.ts      # File utilities
└── public/                   # Static assets
```

## How It Works

### 1. File Upload
User selects or drags files into the upload zone. The system validates file type and size.

### 2. Text Extraction
Depending on file type:
- **PDF**: Uses pdf-parse with fallback to OCR (tesseract.js)
- **DOCX**: Uses mammoth
- **Images**: Uses tesseract.js for OCR
- **Text**: Direct text reading

### 3. Classification (Hybrid Approach)
1. **Rules First**: Fast rule-based classification using keywords
   - If confidence ≥ 0.8, classification is complete
   - Otherwise, proceeds to AI classification
2. **AI Fallback**: Groq API for uncertain cases
   - Uses strict classification prompt
   - Returns category with high confidence

### 4. File Organization
Classified files are automatically organized into:
```
sorted/
├── Invoices/
├── Finance/
├── Medical Reports/
├── Legal/
├── Academic/
├── Receipts/
├── Personal Documents/
└── Others/
```

## API Endpoints

### POST `/api/upload`

Upload and classify a document.

**Request:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@document.pdf"
```

**Response:**
```json
{
  "filename": "document.pdf",
  "category": "Invoices",
  "confidence": 0.95,
  "mode": "rules",
  "originalPath": "/uploads/document.pdf",
  "organizedPath": "/sorted/Invoices/document.pdf"
}
```

## Configuration

### Supported File Types
- **PDF**: `application/pdf`
- **DOCX**: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Images**: `image/jpeg`, `image/png`, `image/webp`, `image/tiff`
- **Text**: `text/plain`

### Maximum File Size
- 50MB per file

### Classification Categories
Defined in `lib/services/classifier/ruleClassifier.ts` with keyword patterns for each category.

## Deployment

### Deploy to Vercel

```bash
vercel
```

Ensure environment variables are set in Vercel project settings:
- `GROQ_API_KEY`: Your Groq API key

### Environment Variables

Create `.env.local` with:
```
GROQ_API_KEY=your_groq_api_key_here
```

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Text Extraction**: 
  - pdf-parse (PDF text)
  - mammoth (DOCX)
  - tesseract.js (OCR for images)
- **AI Classification**: Groq API (llama3/mixtral)
- **File Management**: Node.js fs module

## Development

### Add New Classification Category

1. Add keyword patterns to `ruleClassifier.ts`:
```typescript
'New Category': {
  keywords: ['keyword1', 'keyword2'],
  weight: 1.0,
}
```

2. Update the classifier prompt if needed

3. Test with sample documents

### Improve Classification Accuracy

- Adjust keyword weights in `ruleClassifier.ts`
- Modify the Groq prompt in `aiClassifier.ts` (maintaining structure)
- Monitor confidence scores in upload results

## Error Handling

- **Unsupported File Type**: Returns error with supported types list
- **File Too Large**: Returns error with size limit
- **Extraction Failure**: Gracefully falls back to document name analysis
- **API Failure**: Rules-based classification used as fallback
- **Network Issues**: Clear error messages to user

## Performance

- Rule-based classification: < 100ms
- AI classification: 1-3 seconds (Groq API)
- Text extraction: 1-5 seconds depending on file size
- Total processing: 2-8 seconds per document

## Troubleshooting

### GROQ_API_KEY not set error
1. Verify `.env.local` exists with GROQ_API_KEY
2. Restart the dev server: `pnpm dev`
3. Check Vercel settings if deployed

### File not being classified correctly
1. Check confidence score in results
2. Verify file content has clear indicators
3. Review keyword patterns in ruleClassifier.ts
4. Test with Groq API directly if needed

### OCR not working on images
1. Verify image is clear and readable
2. Check file size (should be < 50MB)
3. Ensure tesseract.js is properly loaded

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.
