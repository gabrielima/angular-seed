var gulp         = require('gulp');
var path         = require('path');
var del          = require('del');
var wrap         = require('gulp-wrap');
var htmlmin      = require('gulp-htmlmin');
var plumber      = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var cache        = require('gulp-cache');
var sass         = require('gulp-sass');
var ngAnnotate   = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var browserSync  = require('browser-sync').create();

var vendors_js = [
  'angular/angular.min.js',
  'angular-ui-router/release/angular-ui-router.min.js',
  'angular-animate/angular-animate.min.js',
  'angular-messages/angular-messages.min.js',
  'angular-sanitize/angular-sanitize.min.js',
  'angular-i18n/angular-locale_pt-br.js',
  'firebase/firebase.js',
  'angularfire/dist/angularfire.min.js'
];

var vendors_css = [];

/**
 *  CLEAR DIST
 */
gulp.task('clear', function() {
  return del(['dist/*']);
});

/**
 *	MINIFY INDEX.HTML
 */

gulp.task('html', function() {
	gulp.src('./src/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('./dist/'));
});

/**
 *	COMPRESS IMAGES
 */

gulp.task('images', [], function(){
	gulp.src('./src/img/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
	.pipe(gulp.dest('./dist/img/'));
});


/**
 *	COMPILE SASS, CONCAT AND MINIFY
 */

gulp.task('styles', function() {
	return gulp.src('./src/css/main.scss')
	  .pipe(plumber(function(error) {
	    console.log("STYLES : " + error.message);
	    this.emit('end');
	  }))   	
	  .pipe(sass({
	    outputStyle: 'compressed',
	    errLogToConsole: true
	  }))
	  .pipe(autoprefixer({
	    browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
	    cascade:  true
	  }))
	  .pipe(gulp.dest('././dist/css/'))
	  .pipe(browserSync.stream());
});


/**
 *	MINIFY ALL APP VIEWS AND CACHE
 */

gulp.task('templates', function() {
	return gulp.src('./src/app/**/*.html')
    .pipe(plumber(function(error) {
      console.log("TEMPLATES : " + error.message);
      this.emit('end');
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(templateCache({
      root: 'app',
      standalone: true,
      transformUrl: function (url) {
        return url.replace(path.dirname(url), '.');
      }
    }))
    .pipe(gulp.dest('./src/tmp/'))
    .pipe(browserSync.stream()); 
})


/**
 *	CREATE APP BUNDLE
 */

gulp.task('bundle', ['vendors', 'templates'], function(){
	return gulp.src([
			'./src/app/**/*.module.js',
			'./src/app/**/*.filter.js',
			'./src/app/**/*.service.js',
			'./src/app/**/*.directive.js',
			'./src/app/**/*.controller.js',
			'./src/app/**/*.component.js',
      './src/tmp/templates.js',
			'./src/app/app.js',
    ])
    .pipe(plumber(function(error) {
      console.log("BUNDLE : " + error.message);
      this.emit('end');
    }))    	
    .pipe(jshint())
    .pipe(jshint.reporter('default'))      
    .pipe(wrap('(function(){<%= contents %>})();'))
    .pipe(concat('bundle.js'))
    .pipe(ngAnnotate())
    .pipe(wrap('(function(angular){\n\'use strict\';\n<%= contents %>})(window.angular);'))
    .pipe(uglify())
    .pipe(gulp.dest('././dist/js'))
    .pipe(browserSync.stream());
});


/**
 *	CONCAT VENDORS
 */

gulp.task('vendors', function() {
	gulp.src(vendors_js.map(function(item){ return  'node_modules/' + item; }))
	  .pipe(concat('vendors.js'))
	  .pipe(gulp.dest('./dist/js'));

	gulp.src(vendors_css.map(function(item){ return  'node_modules/' + item; }))
	    .pipe(concat('vendors.css'))
		  .pipe(gulp.dest('./dist/css'));	 
})


/**
 *	RUN SERVER WITH LIVERELOAD
 */

gulp.task('serve', ['images', 'styles', 'bundle', 'html'], function() {
	return browserSync.init({
	  files: './dist',
	  port: 8000,
	  server: {
	    baseDir: './dist'
	  }
	});
});

gulp.task('watch', ['serve'], function() {
	gulp.watch("./src/img/*", ['images']);
	gulp.watch("./src/index.html", ['html']);
	gulp.watch(['./src/app/**/*'], ['bundle']);
  gulp.watch("./src/css/**/*.scss", ['styles']);
});

gulp.task('default', [
  'watch'
]);
