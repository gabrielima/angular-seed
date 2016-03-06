var gulp         = require('gulp'),
		htmlmin      = require('gulp-htmlmin'),
		plumber      = require('gulp-plumber'),
		rename       = require('gulp-rename'),
		autoprefixer = require('gulp-autoprefixer'),
		concat       = require('gulp-concat'),
		//jshint       = require('gulp-jshint'),
		uglify       = require('gulp-uglify'),
		imagemin     = require('gulp-imagemin'),
		cache        = require('gulp-cache'),
		nano         = require('gulp-cssnano'),
		sass         = require('gulp-sass'),
		browserSync  = require('browser-sync').create();

gulp.task('default', ['html', 'views', 'styles', 'scripts', 'images', 'serve']);

gulp.task('html', function() {
	gulp.src('src/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('dist'));
});

gulp.task('views', function() {
	gulp.src('src/views/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('dist/views'))
});

gulp.task('images', function(){
	gulp.src('src/img/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
	.pipe(gulp.dest('dist/img/'));
});

gulp.task('styles', function(){
	gulp.src(['src/css/**/*.scss'])
	.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}}))
	.pipe(sass())
	.pipe(autoprefixer('last 2 versions'))
	.pipe(gulp.dest('dist/css/'))
	.pipe(rename({suffix: '.min'}))
	.pipe(nano())
	.pipe(gulp.dest('dist/css/'))
	.pipe(browserSync.stream())
});

gulp.task('scripts', function(){
	return gulp.src(['src/js/app.js',
      'src/js/services/*.js',
      'src/js/directives/*.js',
      'src/js/controllers/*.js',
			'src/js/scripts.js'
    ])
	.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}}))
	//.pipe(jshint())
	//.pipe(jshint.reporter('default'))
	.pipe(concat('main.js'))
	.pipe(gulp.dest('dist/js/'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js/'))
	.pipe(browserSync.stream())
});


gulp.task('serve', ['styles', 'scripts', 'html', 'views'], function() {

	browserSync.init({
		ui: {
			port: 8000
		},
		server: "./dist"
	});

	gulp.watch("src/css/**/*.scss", ['styles']);
	gulp.watch("src/js/**/*.js", ['scripts']);
	gulp.watch("src/img/*", ['images']);
	gulp.watch("src/*.html", ['html']).on('change', browserSync.reload);
	gulp.watch("src/views/*.html", ['views']).on('change', browserSync.reload);
});
