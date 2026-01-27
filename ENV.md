# Environment Variables Configuration

This project uses environment variables to configure the base URL and other settings.

## Available Variables

### `VITE_BASE_URL`
The base URL path where the application will be served.

**Examples:**
- Development: `/` (or empty)
- Production: `/avaya/online-order`
- Custom: `/my-custom-path`

**Important:** 
- The value should start with `/`
- Vite will automatically add a trailing `/` for the build
- React Router will use this value (without trailing slash) for the basename

### `VITE_API_BASE_URL` (Optional)
The base URL for API endpoints. Currently commented out but available for future use.

## Environment Files

### `.env`
Main environment file. Edit this for your local configuration.
**⚠️ This file is gitignored - your changes won't be committed.**

### `.env.example`
Template file showing available variables. Safe to commit.

### `.env.development`
Development-specific overrides. Used when running `npm run dev`.

### `.env.production`
Production-specific overrides. Used when running `npm run build`.

## Priority Order

Vite loads environment variables in this order (later files override earlier ones):
1. `.env`
2. `.env.local` (gitignored)
3. `.env.[mode]` (e.g., `.env.production`)
4. `.env.[mode].local` (gitignored)

## Usage

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your values:**
   ```bash
   VITE_BASE_URL=/avaya/online-order
   ```

3. **Rebuild after changes:**
   ```bash
   npm run build
   ```

## Changing the Base URL

To change where the app is served:

1. Edit `.env` file:
   ```bash
   VITE_BASE_URL=/your/new/path
   ```

2. Update `.htaccess` rewrite rules in WordPress root to match

3. Update `online-order.php` if the path structure changes

4. Rebuild:
   ```bash
   npm run build
   ```

## Notes

- Environment variables prefixed with `VITE_` are exposed to client-side code
- Changes to `.env` require a rebuild to take effect
- For development, you can use different values in `.env.development`
