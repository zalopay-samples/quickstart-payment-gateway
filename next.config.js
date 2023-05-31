const {
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')

module.exports = (phase) => {
   // when `next build` or `npm run build` is used
   const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'

   const env = {
    ZLP_MERCHANT_APP_ID: '15847',
    ZLP_MERCHANT_KEY1: '0U93tRzdWEkMLVNYH90aBu5ca0Psql8T',
    ZLP_MERCHANT_KEY2: 'PurTcToVhvUt7vR2jO6He4lh3nfNEiks',
    ZLP_MERCHANT_ENDPOINT: 'https://sb-openapi.zalopay.vn/v2/',
    ZLP_MERCHANT_GATEWAY_ENDPOINT: 'https://sbgateway.zalopay.vn/',
    ZLP_MERCHANT_CALLBACK_URL: 'https://7f30-1-53-255-145.ngrok-free.app/api/callback',
    ZLP_REDIRECT_URL: (() => {
      // For prod env
      if (isProd) return "https://zalopay-payment-gateway.vercel.app/result"
      // For local env
      return "http://localhost:3000/result"
    })(),
   }
   return {
    webpack5: true,
    env
   }
};
