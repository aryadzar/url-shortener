/**
 * An Array of routes that are accesible to public
 * these routes do not required authentication
 * @type{string[]}
 */

export const publicRoutes = ["/:key/detail"];

/**
 * An Array of routes that are use for authentication
 * these routes will redirect logged in users /dashboard
 * @type{string[]}
 */

export const authRoutes = ["/auth/login", "/auth/register"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
