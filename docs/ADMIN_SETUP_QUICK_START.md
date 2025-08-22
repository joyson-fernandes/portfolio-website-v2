
# Quick Start: Admin Panel Setup

## 🚀 Immediate Setup (2 minutes)

### 1. Set Admin Password
Create `.env.local` in your project root:
```bash
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

### 2. Access Admin Panels
- **Method 1**: Click the ⚙️ settings icon (top-right corner)
- **Method 2**: Press `Ctrl + Shift + A` anywhere on the page
- **Method 3**: Automatic in development mode

### 3. Admin Controls
After login, you'll see controls in top-right:
- 👁️ = Show admin panels
- 👁️‍🗨️ = Hide admin panels
- 🔓 = Logout

## 📍 Admin Panel Locations

| Panel | Location | Purpose |
|-------|----------|---------|
| Certifications Admin | Bottom-right | Manage Credly certifications |
| Experience Admin | Bottom-right | Manage LinkedIn experience |
| Projects Admin | Bottom-left | Manage Medium projects |

## ⚡ Default Behavior

- **Development**: Admin panels visible by default
- **Production**: Admin panels hidden by default
- **Session**: Login state persists until browser close

## 🔒 Security Notes

1. Change the default password (`admin123`) for production
2. Keep `.env.local` out of version control
3. Admin access is session-based (no persistent cookies)

---

**Need help?** Check the full documentation: `docs/ADMIN_PANEL_MANAGEMENT.md`
