var gulp = require("gulp");
var postcss=require("gulp-postcss");                //载入postcss
var autoprefixer=require("autoprefixer");           //自动根据caniuse来生成兼容的CSS代码
var cssvars=require("postcss-simple-vars");         //用来把变量用在CSS中
var nested=require('postcss-nested');				//使代码可以寄宿，工整CSS开发
var cssImport=require('postcss-import');		    //需要在postcss中第一个引入
var mixins=require('postcss-mixins');
var hexrgba=require('postcss-hexrgba');               //动态改变字体大小
gulp.task('styles',function(){
    console.log('gulp_styles running');
	return gulp.src('./autoConfig.css')
	.pipe(postcss([cssImport, mixins, cssvars, autoprefixer, hexrgba, nested]))
	.on('error',function(errorMessage){
		console.log(errorMessage.toString);
		this.emit('end');
	})
	.pipe(gulp.dest('./style_modify'));
	console.log("CSS has changed!");
});

//gulp.src()
//gulp.dest()
//pipe()
//PostCSS filter