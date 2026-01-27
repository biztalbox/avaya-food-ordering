# Deployment Guide for Online Order React App

This guide explains how to build and deploy the React application to be served at `/online-order` in your WordPress installation.

## Setup Complete ✅

The following has been configured:

1. **Environment Variables**: Created `.env` files for configurable base URL
2. **Vite Configuration**: Updated to use `VITE_BASE_URL` from environment
3. **React Router**: Configured to use `VITE_BASE_URL` for basename
4. **WordPress Integration**: Created `online-order.php` to serve the React app
5. **Apache Rewrite Rules**: Updated `.htaccess` to handle routing and static assets

## Configuration

The base URL is configured via environment variables. Edit the `.env` file to change the base path:

```bash
# .env
VITE_BASE_URL=/avaya/online-order
```

For different environments:
- **Development**: Use `.env.development` (defaults to `/`)
- **Production**: Use `.env.production` (defaults to `/avaya/online-order`)
- **Custom**: Edit `.env` file directly

## Building the Application

To build the React app for production:

```bash
cd order/avaya-food-ordering
npm run build
```

This will create a `dist` folder with the production build. The build will use the `VITE_BASE_URL` from your `.env` or `.env.production` file.

## How It Works

1. **Static Assets**: Files in `dist/assets/` are served directly via Apache rewrite rules
2. **Client-Side Routing**: All routes under `/online-order` are handled by the React app
3. **WordPress Integration**: The `online-order.php` file serves the React app's `index.html`

## Accessing the App

Once built, access your React app at:
- **URL**: `http://localhost/avaya/online-order`

## Development vs Production

- **Development**: Run `npm run dev` - the app runs on port 8080 with hot reload
- **Production**: Build with `npm run build` and access via WordPress at `/online-order`

## Troubleshooting

### App shows "Building..." message
- Make sure you've run `npm run build` in the `avaya-food-ordering` directory
- Check that the `dist` folder exists and contains `index.html`

### 404 errors on routes
- Ensure `.htaccess` rewrite rules are active
- Check that `mod_rewrite` is enabled in Apache
- Verify the `VITE_BASE_URL` in your `.env` file matches your WordPress installation path
- Make sure to rebuild after changing `.env` values: `npm run build`

### Assets not loading
- Clear browser cache
- Verify the `dist/assets/` directory exists after building
- Check Apache rewrite rules for asset serving

## Notes

- The React app is completely independent of WordPress - it only uses WordPress as a hosting platform
- API calls to `/api/` endpoints should work as configured
- The app uses client-side routing, so all navigation is handled by React Router
