//const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
//const IgnoreDynamicRequire = require('webpack-ignore-dynamic-require');
module.exports = function override(config, env) {
//	config.plugins.push( new NodePolyfillPlugin() )
	config.resolve.fallback = {
		"timers": require.resolve("timers-browserify"),
//		"stream": require.resolve("stream-browserify"),
//		"os": false,
//		"path": false,
//		"fs": false,
//		"child_process": false
	} ;

//	config.plugins = [
//		new IgnoreDynamicRequire()
//	];

    return config;
};
