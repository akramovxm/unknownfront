export const BACKEND_URL = 'http://localhost:8080';

export const OAUTH2_REDIRECT_URI = 'http://localhost:4200' + '/oauth2/redirect'

export const GOOGLE_AUTH_URL = BACKEND_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL = BACKEND_URL + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI;
