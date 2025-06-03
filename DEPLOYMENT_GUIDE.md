# Vercel Deployment Guide

## Environment Variables Required for Production

Make sure to set these environment variables in your Vercel dashboard:

### Database
```
DATABASE_URL="your-production-database-url"
DIRECT_URL="your-direct-database-url"  # For Prisma migrations
```

### Admin Authentication
```
ADMIN_USERNAME="your-admin-username"
ADMIN_PASSWORD="your-secure-password"
```

### Other Optional Variables
```
NODE_ENV="production"
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
```

## Deployment Steps

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Fix chatbot production errors with enhanced error handling"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Push to GitHub repository
   - Vercel will automatically deploy from main branch
   - Check deployment logs for any issues

3. **Post-deployment checks:**
   - Test chatbot API endpoint: `https://your-domain.vercel.app/api/chatbot`
   - Check database connectivity
   - Verify admin panel access

## Error Handling Improvements

✅ **Added robust database error handling**
- Safe database operation wrapper
- Graceful fallbacks when database is unavailable
- Non-blocking learning operations

✅ **Enhanced chatbot resilience**  
- Direct response generation instead of internal API calls
- Fallback responses for all error scenarios
- Improved intent detection with multiple fallback layers

✅ **Production-ready error responses**
- User-friendly error messages
- Structured JSON responses
- Proper HTTP status codes

## Testing Production Deployment

Use the test script to verify production functionality:
```bash
node test-production-chatbot.js
```

Or test manually:
```bash
curl -X POST https://your-domain.vercel.app/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Xin chào", "sessionId": "test_123"}'
```

## Troubleshooting

### Common Issues:
1. **Database connection errors**: Check DATABASE_URL in Vercel dashboard
2. **Missing environment variables**: Verify all required vars are set
3. **Build failures**: Check build logs in Vercel dashboard

### Quick Fixes:
- Redeploy after environment variable changes
- Check Prisma schema is properly generated
- Verify Next.js build configuration
