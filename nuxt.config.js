
export default {
  mode: 'spa',
  router: {
    middleware: 'check-auth'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#9ccc65', height: '5px' },
  /*
  ** Global CSS
  */
  css: [
    { src: 'vue-material/dist/vue-material.min.css', lang: 'css'},
    { src: '~/assets/theme', lang: 'scss'}
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vue-material' },
    { src: '~/plugins/axios' },
    { src: '~/plugins/firestore' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  axios: {
    proxy: true,
    credentials: true
  },
  proxy: {
    "/api/": {
      target: "https://newsapi.org/v2/",
      pathRewrite: { "^/api/": "" }
    },
    "/register/": {
      target: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBz0us1giAY4bYLK2f6K-Nrf9J611w0qlo",
      pathRewrite: { "^/register/": "" }
    },
    "/login/": {
      target: "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBz0us1giAY4bYLK2f6K-Nrf9J611w0qlo",
      pathRewrite: { "^/login/": "" }
    }
  },
  env: {
    NEWS_API_KEY: '63c4e6a1eb4f447cbd27b346e4cd968c'
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
