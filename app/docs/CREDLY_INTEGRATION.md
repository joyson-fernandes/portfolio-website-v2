
# Credly Integration Guide

This portfolio automatically pulls professional certifications from Credly and updates them in real-time.

## Features

- ✅ Automatic fetching from Credly public API
- ✅ Smart caching (1-hour cache with fallback to stale data)
- ✅ Automatic categorization and styling
- ✅ Manual refresh capability
- ✅ Scheduled auto-updates via cron jobs
- ✅ Fallback to static data if API fails
- ✅ Admin panel for monitoring and control

## API Endpoints

### Get Certifications
```
GET /api/certifications?username=your-credly-username
GET /api/certifications?username=your-credly-username&refresh=true
```

### Manual Refresh
```
POST /api/certifications/refresh
```

### Cron Job Endpoint
```
GET /api/cron/refresh-certifications
```

## Setup Instructions

### 1. Configure Credly Username
The default username is `joyson-fernandes`. To change it, update the `useCertifications` hook call in the `Certifications` component:

```tsx
const { certifications, loading, error, lastUpdated, refetch } = useCertifications('your-username')
```

### 2. Environment Variables (Optional)
Create a `.env.local` file:

```env
# Optional: Webhook authentication token
CREDLY_WEBHOOK_TOKEN=your-secret-token

# Optional: Cron job authentication
CRON_SECRET=your-cron-secret

# Optional: Show admin panel in production
SHOW_ADMIN=true
```

### 3. Set up Automatic Updates

#### Option A: External Cron Service (Recommended)
Use services like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com/):

1. Create a new cron job
2. Set URL: `https://your-domain.com/api/cron/refresh-certifications`
3. Set schedule: Every hour (`0 * * * *`)
4. Add header: `Authorization: Bearer YOUR_CRON_SECRET` (if using authentication)

#### Option B: Vercel Cron Jobs
If deploying on Vercel, create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/refresh-certifications",
      "schedule": "0 * * * *"
    }
  ]
}
```

#### Option C: GitHub Actions
Create `.github/workflows/refresh-certifications.yml`:

```yaml
name: Refresh Certifications
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Call refresh endpoint
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.com/api/cron/refresh-certifications
```

## Admin Panel

The admin panel is automatically shown in development mode. To access in production:
1. Set `SHOW_ADMIN=true` in your environment variables
2. Look for the settings icon in the bottom-right corner
3. Features:
   - Manual refresh button
   - API status monitoring
   - Cache statistics
   - Cron job testing

## How It Works

1. **First Load**: Fetches certifications from Credly API
2. **Caching**: Stores results in memory cache for 1 hour
3. **Subsequent Loads**: Serves from cache if available
4. **Auto-Refresh**: Cron job updates cache every hour
5. **Fallback**: Uses static data if API fails
6. **Manual Refresh**: Users can force refresh anytime

## Troubleshooting

### API Not Working
1. Check if Credly username is correct
2. Ensure the profile is public
3. Check browser console for errors
4. Try manual refresh from admin panel

### Cron Jobs Not Running
1. Verify cron service is configured correctly
2. Check authentication tokens
3. Test the endpoint manually
4. Review server logs

### Caching Issues
1. Use `?refresh=true` parameter to force refresh
2. Clear cache via admin panel
3. Restart the application
