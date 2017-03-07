'use strict';

var gulp = require('gulp-help')(require('gulp'));

gulp.task('jshint', 'JsHint check for source files.', function () {
  var jshint = require('gulp-jshint');
  return gulp.src('src/**/*.js')
    .pipe(jshint({
      lookup: true
    }))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('cleanup', 'Remove dist folder and its content.', function () {
  var del = require('del');
  return del('dist');
});

gulp.task('build:script', 'Concatenate script files into one file and prepend the banner.', function () {
  var concat = require('gulp-concat'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    fs = require('fs'),
    banner = fs.readFileSync('banner.txt', 'utf8');
  return gulp.src('src/**/*.js')
    .pipe(concat(pkg.name + '.js'))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:compress', 'Compress script files.', function () {
  var sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');
  return gulp.src('dist/**/*.js')
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify({
      output: {
        comments: /@preserve|@license|@cc_on/i
      }
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:gzip', 'Create gzip files.', function () {
  var gzip = require('gulp-gzip');
  return gulp.src('dist/**/*')
    .pipe(gzip())
    .pipe(gulp.dest('dist'));
});

gulp.task('build', 'Build distribution content', function (callback) {
  var runSequence = require('run-sequence');
  runSequence(
    ['jshint', 'cleanup'],
    ['build:script'],
    ['build:compress'],
    ['build:gzip'],
    callback
  );
});

gulp.task('test', 'Run test once and exit', function (done) {
  var Server = require('karma').Server;
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('version', 'Latest project version', function () {
  var bower = require('./package.json');
  console.log('Version:', bower.version);
});