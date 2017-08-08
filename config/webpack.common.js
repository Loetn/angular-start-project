const webpack = require('webpack');
const helpers = require('./helpers');
//const AssetsPlugin = require('assets-webpack-plugin');
//const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ngcWebpack = require('ngc-webpack');
const autoprefixer = require('autoprefixer');
//const PreloadWebpackPlugin = require('preload-webpack-plugin');
var MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");

// Webpack Constants
const HMR = helpers.hasProcessFlag('hot');
const AOT = process.env.BUILD_AOT || helpers.hasNpmFlag('aot');
const METADATA = {
    title: 'TailerMate',
    isDevServer: helpers.isWebpackDevServer(),
    HMR: HMR
};

module.exports = function (options) {
    var isProd = options.env === 'production';
    METADATA.baseUrl = options.baseUrl;
    return {
		/**
		 * Cache generated modules and chunks to improve performance for multiple incremental builds.
		 * This is enabled by default in watch mode.
		 * You can pass false to disable it.
		 * See: http://webpack.github.io/docs/configuration.html#cache
		 */
        //cache: false,
        entry: {
            'polyfills': './src/polyfills.browser.ts',
            'main': AOT ? './src/main.browser.aot.ts' : './src/main.browser.ts'
        },
        resolve: {
            extensions: ['.ts', '.js', '.json'],
            modules: [helpers.root('src'), helpers.root('node_modules')],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: '@angularclass/hmr-loader',
                            options: {
                                pretty: !isProd,
                                prod: isProd
                            }
                        },
                        {
							/**
							 *  MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
							 */
                            loader: 'ng-router-loader',
                            options: {
                                loader: 'async-import',
                                genDir: 'compiled',
                                aot: AOT
                            }
                        },
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: 'tsconfig.webpack.json',
                                useCache: !isProd
                            }
                        },
                        {
                            loader: 'angular2-template-loader'
                        }
                    ],
                    exclude: [/\.(spec|e2e)\.ts$/]
                },
                {
                    test: /\.css$/,
                    use: ['to-string-loader', 'css-loader', 'postcss-loader'],
                    exclude: [helpers.root('src', 'styles')]
                },
                {
                    test: /\.scss$/,
                    use: ['to-string-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
                    exclude: [helpers.root('src', 'styles')]
                },
                {
                    test: /\.html$/,
                    use: 'raw-loader',
                    exclude: [helpers.root('src/index.html')]
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                    use: 'file-loader'
                }
            ],
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                postcss: [autoprefixer],
            }),
            // Use for DLLs
            // new AssetsPlugin({
            //   path: helpers.root('dist'),
            //   filename: 'webpack-assets.json',
            //   prettyPrint: true
            // }),

			/**
			 * Plugin: ForkCheckerPlugin
			 * Description: Do type checking in a separate process, so webpack don't need to wait.
			 *
			 * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
			 */
            new CheckerPlugin(),
			/**
			 * Plugin: CommonsChunkPlugin
			 * Description: Shares common code between the pages.
			 * It identifies common modules and put them into a commons chunk.
			 *
			 * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
			 * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
			 */
            new CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills']
            }),
			/**
			 * This enables tree shaking of the vendor modules
			 */
            // new CommonsChunkPlugin({
            //   name: 'vendor',
            //   chunks: ['main'],
            //   minChunks: module => /node_modules/.test(module.resource)
            // }),
			/**
			 * Specify the correct order the scripts will be injected in
			 */
            // new CommonsChunkPlugin({
            //   name: ['polyfills', 'vendor'].reverse()
            // }),
            // new CommonsChunkPlugin({
            //   name: ['manifest'],
            //   minChunks: Infinity,
            // }),

			/**
			 * Plugin: ContextReplacementPlugin
			 * Description: Provides context to Angular's use of System.import
			 *
			 * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
			 * See: https://github.com/angular/angular/issues/11580
			 */
            new ContextReplacementPlugin(
				/**
				 * The (\\|\/) piece accounts for path separators in *nix and Windows
				 */
                /angular(\\|\/)core(\\|\/)@angular/,
                helpers.root('src'), // location of your src
                {
					/**
					 * Your Angular Async Route paths relative to this root directory
					 */
                }
            ),
            new MergeJsonWebpackPlugin({
                "output": {
                    "groupBy": ["nl", "en"].map(lang => ({
                        "pattern": `{src/assets/i18n/${lang}.json,node_modules/ds-tailermate-web-common/assets/i18n/${lang}.json}`,
                        "fileName": `assets/i18n/${lang}.json`
                    }))
                }
            }),
            new CopyWebpackPlugin([
                { from: 'src/assets', to: 'assets' },
                { from: 'node_modules/ds-tailermate-web-common/assets', to: 'assets' },
            ],
                // Ignore folders in all added 'from' folders because those are merged above
                { ignore: ['i18n/*'] }
            ),
			/*
			 * Plugin: PreloadWebpackPlugin
			 * Description: Preload is a web standard aimed at improving
			 * performance and granular loading of resources.
			 *
			 * See: https://github.com/GoogleChrome/preload-webpack-plugin
			 */
            //new PreloadWebpackPlugin({
            //  rel: 'preload',
            //  as: 'script',
            //  include: ['polyfills', 'vendor', 'main'].reverse(),
            //  fileBlacklist: ['.css', '.map']
            //}),
            //new PreloadWebpackPlugin({
            //  rel: 'prefetch',
            //  as: 'script',
            //  include: 'asyncChunks'
            //}),

			/**
			 * Plugin: ScriptExtHtmlWebpackPlugin
			 * Description: Enhances html-webpack-plugin functionality
			 * with different deployment options for your scripts including:
			 *
			 * See: https://github.com/numical/script-ext-html-webpack-plugin
			 */
            new ScriptExtHtmlWebpackPlugin({
                sync: /polyfill|vendor/,
                defaultAttribute: 'async',
                preload: [/polyfill|vendor|main/],
                prefetch: [/chunk/]
            }),
			/*
			* Plugin: HtmlWebpackPlugin
			* Description: Simplifies creation of HTML files to serve your webpack bundles.
			* This is especially useful for webpack bundles that include a hash in the filename
			* which changes every compilation.
			*
			* See: https://github.com/ampedandwired/html-webpack-plugin
			*/
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                title: METADATA.title,
                chunksSortMode: 'dependency',
                metadata: METADATA,
                inject: 'body'
            }),
			/**
			 * Plugin LoaderOptionsPlugin (experimental)
			 *
			 * See: https://gist.github.com/sokra/27b24881210b56bbaff7
			 */
            new LoaderOptionsPlugin({}),
            new ngcWebpack.NgcWebpackPlugin({
				/**
				 * If false the plugin is a ghost, it will not perform any action.
				 * This property can be used to trigger AOT on/off depending on your build target (prod, staging etc...)
				 *
				 * The state can not change after initializing the plugin.
				 * @default true
				 */
                disabled: !AOT,
                tsConfig: helpers.root('tsconfig.webpack.json'),
				/**
				 * A path to a file (resource) that will replace all resource referenced in @Components.
				 * For each `@Component` the AOT compiler compiles it creates new representation for the templates (html, styles)
				 * of that `@Components`. It means that there is no need for the source templates, they take a lot of
				 * space and they will be replaced by the content of this resource.
				 *
				 * To leave the template as is set to a falsy value (the default).
				 *
				 * TIP: Use an empty file as an overriding resource. It is recommended to use a ".js" file which
				 * usually has small amount of loaders hence less performance impact.
				 *
				 * > This feature is doing NormalModuleReplacementPlugin for AOT compiled resources.
				 *
				 * ### resourceOverride and assets
				 * If you reference assets in your styles/html that are not inlined and you expect a loader (e.g. url-loader)
				 * to copy them, don't use the `resourceOverride` feature as it does not support this feature at the moment.
				 * With `resourceOverride` the end result is that webpack will replace the asset with an href to the public
				 * assets folder but it will not copy the files. This happens because the replacement is done in the AOT compilation
				 * phase but in the bundling it won't happen (it's being replaced with and empty file...)
				 *
				 * @default undefined
				 */
                resourceOverride: helpers.root('config/resource-override.js')
            }),
			/**
			 * Plugin: InlineManifestWebpackPlugin
			 * Inline Webpack's manifest.js in index.html
			 *
			 * https://github.com/szrenwei/inline-manifest-webpack-plugin
			 */
            new InlineManifestWebpackPlugin(),
        ],
		/**
		 * Include polyfills or mocks for various node stuff
		 * Description: Node configuration
		 *
		 * See: https://webpack.github.io/docs/configuration.html#node
		 */
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };
}