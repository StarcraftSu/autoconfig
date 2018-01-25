var gulp = require("gulp");                
var watch = require("gulp-watch");                  //gulp监听 
var browserSync=require('browser-sync').create();   //网页同步

gulp.task('watch',function(){
	notify:false,
	browserSync.init({
		server:{
			baseDir:"autoConfig"
		}
	});

	watch("./index.html",function(){
		console.log('html changed');
		browserSync.reload();
	});

	watch('./autoConfig.css',function(){
		gulp.start('cssInject');
	});


	// watch('autoConfig.js',function(){
	// 	gulp.start('jsInject');
	// })
});


gulp.task('cssInject',['styles'],function(){
	return gulp.src('style_modify/autoConfig.css')
	.pipe(browserSync.stream());
});

// gulp.task('jsInject',['scripts'],function(){
// 	return gulp.src('./app/temp/scripts/app.js')
// 	.pipe(browserSync.stream());

// });
