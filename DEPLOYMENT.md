# Deployment Guide

## Local Development

### Prerequisites
- Node.js 18 or higher
- npm, pnpm, or yarn

### Setup Steps

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd document-organizer
   pnpm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Groq API key:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000

## Deployment to Vercel

### Option 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts to connect your GitHub repository and configure settings.

3. **Set Environment Variables**
   - Go to Vercel Project Settings → Environment Variables
   - Add `GROQ_API_KEY` with your Groq API key value

4. **Redeploy**
   ```bash
   vercel
   ```

### Option 2: Using GitHub Integration

1. **Push to GitHub**
   ```bash
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Visit https://vercel.com/new
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment**
   - During import, click "Environment Variables"
   - Add `GROQ_API_KEY`
   - Click "Deploy"

### Option 3: Manual Vercel Deployment

1. **Build Locally**
   ```bash
   pnpm build
   ```

2. **Test Build**
   ```bash
   pnpm start
   ```

3. **Deploy Using Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "New Project"
   - Upload the project folder or connect GitHub

## Environment Configuration

### Required Variables
- `GROQ_API_KEY` - Your Groq API key from https://console.groq.com

### Optional Variables
None at this time.

## Storage Configuration

### Local/Development
Files are stored in:
- `/uploads` - Temporary upload storage
- `/sorted` - Organized files by category

### Vercel Deployment
Note: Vercel serverless functions have limited filesystem access. For production:

1. **Use Vercel Blob** (Recommended)
   ```bash
   pnpm add @vercel/blob
   ```

2. **Update fileManager.ts** to use Blob:
   ```typescript
   import { put } from '@vercel/blob';
   
   // Replace fs.writeFileSync with put()
   const blob = await put(`${path}/${filename}`, buffer, {
     access: 'private',
   });
   ```

3. **Set BLOB_READ_WRITE_TOKEN** environment variable

### Alternative: Persist Data to Database
- Store file metadata in PostgreSQL/MongoDB
- Use cloud storage (AWS S3, Google Cloud Storage)

## Performance Optimization

### For Production

1. **Enable Response Compression**
   In `next.config.mjs`:
   ```javascript
   export default {
     compress: true,
   };
   ```

2. **Optimize Images**
   - Use Next.js Image component
   - Enable image optimization

3. **Enable Caching**
   - Set appropriate Cache-Control headers
   - Use ISR for static pages

### Monitoring

1. **Set up Vercel Analytics**
   - Provides performance metrics
   - Monitors serverless function execution

2. **Monitor Groq API Usage**
   - Check Groq console for rate limits
   - Monitor API costs

## Security Considerations

### Production Checklist

- [ ] Environment variables are set (not in code)
- [ ] File uploads are validated
- [ ] File size limits enforced (50MB)
- [ ] Supported file types only
- [ ] API endpoints have rate limiting (add later)
- [ ] GROQ_API_KEY is private
- [ ] Files are scanned for malware (optional)
- [ ] User authentication added (optional)

### Recommendations

1. **Add File Scanning**
   - Integrate ClamAV for virus scanning
   - Run before processing

2. **Add User Authentication**
   - Use Auth.js or similar
   - Track uploads per user

3. **Add Rate Limiting**
   - Limit uploads per user/IP
   - Use Upstash Redis

4. **Add Encryption**
   - Encrypt sensitive file data
   - Use TLS/HTTPS (automatic with Vercel)

## Scaling Considerations

### Current Limitations
- Vercel serverless timeout: 30 seconds (Pro) or 60 seconds (Enterprise)
- Processing time: ~5-10 seconds per file
- Max concurrent functions: depends on plan

### Scaling Solutions

1. **For Larger Files**
   - Use Next.js API route streaming
   - Process in background with Vercel Functions
   - Queue processing with Vercel Queues

2. **For High Volume**
   - Implement job queue (Bull, RabbitMQ)
   - Use serverless workers (e.g., Cloudflare Workers)
   - Scale horizontally with container deployment

3. **Database Integration**
   - Store file metadata
   - Track processing status
   - Enable search/filtering

## Troubleshooting Deployment

### GROQ_API_KEY Not Found
```bash
# Check environment variables are set
vercel env pull

# Verify in Vercel dashboard
# Settings → Environment Variables
```

### Build Failures
```bash
# Check logs
vercel logs

# Test build locally
pnpm build
```

### File Upload Issues
- Check disk space (for Vercel Blob)
- Verify file permissions
- Check file size limit (50MB)
- Review API response in browser DevTools

### API Timeouts
- Reduce file size limit
- Optimize text extraction
- Upgrade to Vercel Pro/Enterprise
- Implement async processing queue

## Rollback Procedures

### Vercel
```bash
# View deployment history
vercel deployments

# Revert to previous version
vercel rollback
```

### Local Git
```bash
# Check commit history
git log

# Revert to previous commit
git revert <commit-hash>
git push origin main
```

## Continuous Integration/Deployment

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build
      
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Setup Secrets
1. Get Vercel tokens from https://vercel.com/account/tokens
2. Add to GitHub Secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## Support

- Vercel Docs: https://vercel.com/docs
- Groq Docs: https://console.groq.com/docs
- Next.js Docs: https://nextjs.org/docs
- Deployment Issues: Check Vercel logs and error messages
