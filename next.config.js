/** @type {import('next').NextConfig} */

const { withSentryConfig } = require("@sentry/nextjs");
const nextConfig = {

    // Optional build-time configuration options
    sentry: {
        disableServerWebpackPlugin: false,
        disableClientWebpackPlugin: false,
        transpileClientSDK: process.env.NODE_ENV != 'development',
        // See the sections below for information on the following options:
        //   'Configure Source Maps':
        //     - disableServerWebpackPlugin
        //     - disableClientWebpackPlugin
        //     - hideSourceMaps
        //     - widenClientFileUpload
        //   'Configure Legacy Browser Support':
        //     - transpileClientSDK
        //   'Configure Serverside Auto-instrumentation':
        //     - autoInstrumentServerFunctions
        //     - excludeServerRoutes
        //   'Configure Tunneling to avoid Ad-Blockers':
        //     - tunnelRoute
    },
}

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, configFile, stripPrefix, urlPrefix, include, ignore
  
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  
    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,
  
    silent: true, // Suppresses all logs
  
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
