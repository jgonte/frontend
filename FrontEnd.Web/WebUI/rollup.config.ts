import typescript from 'rollup-plugin-typescript2';

export default [{
	input: './compiled/index.js',
	output: {
		file: '../wwwroot/lib/gcs-lib.js',
		format: 'esm'
	},
	context: 'window',
	
	plugins: [
		typescript({
			typescript: require('typescript')
		})
	]
}];