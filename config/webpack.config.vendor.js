// var isDevBuild = process.argv.indexOf('--env.prod') < 0;
// var path = require('path');
// var webpack = require('webpack');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var extractCSS = new ExtractTextPlugin('vendor.css');
// const autoprefixer = require('autoprefixer');

// module.exports = {
// 	resolve: {
// 		extensions: ['.js', '.ts']
// 	},
// 	module: {
// 		rules: [
// 			{
// 				test: /\.css$/,
// 				loader: extractCSS.extract(['css-loader?minimize', 'postcss-loader'])
// 			},
// 			{
// 				test: /\.scss$/,
// 				loader: extractCSS.extract(['css-loader?minimize', 'postcss-loader', 'sass-loader'])
// 			},
// 			{
// 				test: /bootstrap\/dist\/js\/umd\//,
// 				loader: 'imports-loader?jQuery=jquery'
// 			},
// 			{
// 				test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
// 				loader: 'url-loader?limit=100000'
// 			}
// 		]
// 	},
// 	entry: {
// 		vendor: [
// 			'@angular/common',
// 			'@angular/compiler',
// 			'@angular/core',
// 			'@angular/http',
// 			'@angular/platform-browser',
// 			'@angular/platform-browser-dynamic',
// 			'@angular/router',
// 			'@angular/platform-server',
// 			'bootstrap/scss/bootstrap.scss', // Load partially with bootstrap-loader? https://github.com/shakacode/bootstrap-loader
// 			'@ng-bootstrap/ng-bootstrap',
// 			'core-js',
// 			'zone.js',
// 			'ngx-infinite-scroll',
// 			'@progress/kendo-angular-grid',
// 			'@progress/kendo-angular-intl',
// 			'@progress/kendo-angular-l10n',
// 			'@progress/kendo-data-query',
// 			'@progress/kendo-angular-dateinputs',
// 			'@progress/kendo-angular-dropdowns',
// 			'@progress/kendo-angular-excel-export',
// 			'@progress/kendo-angular-inputs',
// 			'@progress/kendo-drawing',
// 			'@progress/kendo-theme-bootstrap/dist/all.css', // TODO: change to .scss file when out of beta
// 			'@ngx-translate/core',
// 			'@ngx-translate/http-loader',
// 			'font-awesome/scss/font-awesome.scss',
// 			'angular2-busy',
// 			'angular2-busy/build/style/busy.css',
// 			'ng2-validation',
// 			'ds-tailermate-web-common'
// 		]
// 	},
// 	output: {
// 		path: path.join(__dirname, 'src', 'dist'),
// 		filename: '[name].js',
// 		library: '[name]_[hash]',
// 	},
// 	plugins: [
// 		extractCSS,
// 		//new webpack.ProvidePlugin({
// 		//	$: 'jquery',
// 		//	jQuery: 'jquery',
// 		//	'window.jQuery': 'jquery',
// 		//	'Tether': 'tether'
// 		//}),
// 		new webpack.DllPlugin({
// 			path: path.join(__dirname, 'src', 'dist', '[name]-manifest.json'),
// 			name: '[name]_[hash]'
// 		}),
// 		new webpack.LoaderOptionsPlugin({
// 			postcss: [autoprefixer],
// 		}),
// 		//].concat(isDevBuild ? [] : [
// 		// Minify js
// 		new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
// 		//])
// 	]
// };