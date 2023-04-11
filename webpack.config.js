const webpack = require('webpack');
const path = require('node:path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config({ path: './.env' });

const plugins = [
	new HtmlWebpackPlugin({
		template: path.resolve(__dirname, 'src', 'public', 'index.html')
	}),
	new MiniCssExtractPlugin(),
	new webpack.DefinePlugin({
		'process.env': JSON.stringify(process.env)
	})
];

const isDevelopment = process.env.NODE_ENV !== 'development'

module.exports = {
	mode: isDevelopment ? 'development' : 'production',
	plugins,
	devtool: 'source-map',
	entry: path.resolve(__dirname, 'src', 'index.ts'),
	devServer: {
		hot: true,
		port: 1234,
		open: true,
		historyApiFallback: true
	},

	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.js',
		clean: true
	},
	resolve: {
		extensions: ['.ts', '.js', '.hbs', '.png', '.jpg', '.gif', '.scss'],
		alias: {
			handlebars: 'handlebars/dist/handlebars.min.js'
		}
	},
	module: {
		rules: [
			{ test: /\.html$/, use: ['html-loader'] },
			{
				test: /\.(js|ts)x?$/,
				loader: 'ts-loader',
				options: {
					configFile: path.resolve(__dirname, 'tsconfig.json')
				},
				exclude: /node_modules/
			},
			{ test: /\.hbs$/, type: 'asset/source' },
			{
				test: /\.module\.s(a|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: true,
							sourceMap: isDevelopment
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: isDevelopment,
						}
					}
				]
			},
			{
				test: /\.s(a|c)ss$/,
				exclude: /\.module.(s(a|c)ss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDevelopment
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: isDevelopment,
						}
					}
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
				type: !isDevelopment ? 'asset' : 'asset/resource'
			},
			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				type: 'asset/resource'
			}
		]
	}
};
