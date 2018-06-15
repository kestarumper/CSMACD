var gulp = require('gulp');
var browserify = require('gulp-browserify');

// Basic usage
gulp.task('scripts', function () {
  // Single entry point to browserify
  gulp.src('main.js')
    .pipe(browserify({
      insertGlobals: true,
    }))
    .pipe(gulp.dest('./bundle/'))
});

gulp.task('watch', function () {
  gulp.watch('*.js', ['scripts']);
});