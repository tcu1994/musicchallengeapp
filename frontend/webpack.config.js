const Dotenv = require('dotenv-webpack');
module.exports = {

    plugins: [
        new Dotenv(),
        new InterpolateHtmlPlugin({
            PUBLIC_URL: 'static' // can modify `static` to another name or get it from `process`
        })
    ],
    resolve: {
        fallback: {
            'stream':  require.resolve("stream-browserify")
        },
    },
}

