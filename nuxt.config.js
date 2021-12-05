require('dotenv').config()
export default {
    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'figma',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ],
        script: [{
                src: '/js/jquery.slim.min.js',
            },
            {
                src: '/js/bootstrap.bundle.min.js',
            },
            {
                src: '/js/all.min.js',
            },
        ],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ['@/assets/scss/main.scss'],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '~plugins/global',
        { src: '~/plugins/vform', mode: 'client' },
        '~plugins/bootstrap-vue',
        '~plugins/pagination',
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: ['@nuxtjs/router'],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        '@nuxtjs/dotenv',
        '@nuxtjs/auth',
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios',
    ],

    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: { url: '/login', method: 'post', propertyName: 'token' },
                    logout: { url: '/logout', method: 'post' },
                    user: { url: '/me', method: 'get', propertyName: 'data' },
                },
            },
        },
    },

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: { baseUrl: process.env.API_URL, },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        babel: {
            compact: true,
            plugins: [
                ["@babel/plugin-proposal-class-properties", { "loose": true }],
                ["@babel/plugin-proposal-private-methods", { "loose": true }],
                ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
            ]
        },
        extend(config, { isDev, isClient }) {
            if (isClient && !isDev) {
                config.optimization.splitChunks.maxSize = 250000
            }
        }
    }
}