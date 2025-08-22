
# Admin Panel Management System

The portfolio website includes a comprehensive admin panel management system that allows you to hide/show administrative interfaces for managing certifications, experience, and projects.

## Features

- **Password Protection**: Secure access to admin panels with configurable password
- **Toggle Visibility**: Show/hide admin panels with a single click
- **Keyboard Shortcut**: Quick access using `Ctrl + Shift + A`
- **Session Storage**: Remembers your admin state during the session
- **Development Mode**: Auto-show admin panels in development environment

## Access Methods

### 1. Admin Toggle Button
- Look for the settings icon (⚙️) in the top-right corner of the page
- Click to open the admin login modal
- Enter your admin password to access the panels

### 2. Keyboard Shortcut
- Press `Ctrl + Shift + A` anywhere on the page
- This will open the admin login modal if not authenticated
- If already authenticated, it will toggle admin panel visibility

### 3. Development Mode
- Admin panels are automatically visible in development mode (`NODE_ENV=development`)
- No authentication required in development

## Configuration

### Setting Admin Password

1. **Environment Variable (Recommended)**:
   ```bash
   NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
   ```

2. **Default Password**:
   - If no environment variable is set, the default password is `admin123`
   - **Important**: Change this for production use!

### Environment Variables

Create a `.env.local` file in your project root:

```bash
# Admin Panel Configuration
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here

# Optional: Force show admin in production (not recommended)
SHOW_ADMIN=false
```

## Admin Panel Controls

Once authenticated, you'll see admin controls in the top-right corner:

- **👁️ Eye Icon**: Show admin panels
- **👁️‍🗨️ Eye-Off Icon**: Hide admin panels  
- **🔓 Unlock Icon**: Logout from admin mode

## Admin Panel Features

### Certifications Admin
- **Location**: Bottom-right corner (floating panel)
- **Features**:
  - Manual refresh of certifications
  - API status monitoring
  - Cache status indicators
  - Cron job testing
  - Setup instructions for automation

### Experience Admin
- **Location**: Bottom-right corner (floating panel)
- **Features**:
  - View current experience statistics
  - Manual data refresh
  - Save changes functionality
  - Edit mode toggle
  - Latest position preview

### Projects Admin
- **Location**: Bottom-left corner (floating panel)
- **Features**:
  - Projects overview statistics
  - Medium integration status
  - Manual refresh from Medium
  - Latest projects preview
  - Auto-update configuration

## Security Considerations

1. **Production Deployment**:
   - Always set a strong admin password
   - Never commit `.env.local` to version control
   - Consider using environment-specific passwords

2. **Password Management**:
   - Use a unique, strong password
   - Store securely (password manager recommended)
   - Rotate periodically

3. **Access Control**:
   - Admin panels are hidden by default in production
   - Session-based authentication (clears on browser close)
   - No persistent login cookies

## Troubleshooting

### Admin Panels Not Showing
1. Verify you're authenticated (check top-right corner for admin controls)
2. Ensure admin visibility is enabled (eye icon should be filled)
3. Check browser console for any JavaScript errors

### Login Issues
1. Verify the admin password is correctly set
2. Check the `.env.local` file exists and has the correct variable name
3. Restart the development server after changing environment variables

### Development Mode
1. Admin panels should be visible automatically in development
2. If not showing, check that `NODE_ENV=development` is set
3. Verify no errors in the browser console

## Best Practices

1. **Development**:
   - Use the default password or a simple one for development
   - Admin panels are always visible, no need to authenticate

2. **Production**:
   - Set a strong, unique admin password
   - Keep admin access minimal and secure
   - Monitor admin access if needed

3. **Team Access**:
   - Share admin password securely with team members
   - Consider different passwords for different environments
   - Document password rotation procedures

## API Endpoints

The admin panels interact with these API endpoints:

- `/api/certifications` - Certification management
- `/api/certifications/refresh` - Manual certification refresh
- `/api/experience` - Experience data management
- `/api/projects` - Project management
- `/api/projects/refresh-medium` - Medium integration refresh
- `/api/cron/refresh-certifications` - Automated certification updates

## Customization

### Changing Admin Password Location
Edit `/app/contexts/AdminContext.tsx`:
```typescript
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'your_new_default'
```

### Disabling Admin in Production
Set environment variable:
```bash
SHOW_ADMIN=false
```

### Customizing Keyboard Shortcut
Edit `/app/components/admin-toggle.tsx`:
```typescript
if (e.ctrlKey && e.shiftKey && e.key === 'YourKey') {
  // Your custom shortcut
}
```

## Updates and Maintenance

The admin system is designed to be:
- **Self-contained**: All admin logic is in dedicated components
- **Non-intrusive**: Doesn't affect main website functionality
- **Easily removable**: Can be completely disabled if needed

For updates or issues, check the admin component files:
- `/app/contexts/AdminContext.tsx`
- `/app/components/admin-toggle.tsx`
- `/app/components/admin-wrapper.tsx`
