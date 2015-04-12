var gulp = require('gulp'),
	connect = require('gulp-connect'),
	del = require('del'),
	watch = require('gulp-watch'),
	runSequence = require('run-sequence'),
	babelify = require('babelify'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream');

var APP_PATH = './app',
	WEB_PATH = './.web';

gulp.task('clear', function(cb) {
	del([ WEB_PATH + '/*' ], function() {
		cb();
	});
});

gulp.task('js', function() {
	return browserify({
					entries: APP_PATH + '/app.js',
					debug: true
				})
				.transform(babelify)
				.bundle()
				.pipe(source('app.js'))
				.pipe(gulp.dest(WEB_PATH));
});

gulp.task('index', function() {
	return gulp.src([ APP_PATH + '/index.html' ])
		.pipe(gulp.dest(WEB_PATH));
});

gulp.task('connect', function(cb) {
	connect.server({
		root: WEB_PATH,
		livereload: true
	});

	cb();
});

gulp.task('livereload', function () {
	return gulp.src( WEB_PATH + '/**/*' )
		.pipe(connect.reload());
});

gulp.task('serve', [ 'clear' ], function(cb) {
	runSequence(
		[ 'js', 'index' ],
		'connect',
		function() {			
			watch([ APP_PATH + '/app.js' ], function() { gulp.start('js'); });
			watch([ APP_PATH + '/index.html' ], function() { gulp.start('index'); });
			watch([ WEB_PATH + '/**/*' ], function() { gulp.start('livereload'); });

			cb();
		}
	);
});