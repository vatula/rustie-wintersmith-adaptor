var vinylPaths  = require('vinyl-paths');
var gulpIf      = require('gulp-if');
var concat      = require('gulp-concat');
var babel       = require('gulp-babel');
var mocha       = require('gulp-mocha');
var gulp        = require('gulp');
var del         = require('del');
                  require('babel-core/register');

var sources = 'src/main/javascript';
var tests   = 'src/test/javascript';
var project = 'com/robobeak/rustie/plugins/wintersmith-adaptor';

gulp.task('clear', function() {
  return gulp.src('lib/*', {read: false})
    .pipe(vinylPaths(del));
});

gulp.task('default', ['clear'], function() {
  return gulp.src([sources, project, '**/*.js'].join('/'))
    .pipe(babel({
      'stage': 1,
      'modules': 'umd',
      'optional': ['runtime']
    }))
    .pipe(gulp.dest('lib/javascript'));
});

gulp.task('test', function() {
  return gulp.src([tests, project, '**/*.js'].join('/'), {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});