
var path = require('path');   //npm 内置的绝对路径


module.exports = {
	entry:{
		App:"./app/assets/scripts/app.js",
		Vendor:"./app/assets/scripts/vendor.js"
	},
	output:{
		path:path.resolve(__dirname,"./app/temp/scripts"),
		filename:"[name].js"
	},
	module:{
		loaders:[
			{
				loader:'babel-loader',
				query:{
					presets:['es2015']
				},
				//Tell the web-broswer that we only
				//want to apply babel to javascript
				test:/\.js$/,
				//排除那些不需要转译成ES6的JS代码比如jQuery
				exclude: /node_modules/
			}
		]

	}
}