var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('sass', function () {
  return gulp.src('app/theme.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('useref', function () {
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      // Setting interlaced to true for GIFs
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean', function () {
  return del.sync('dist');
})

gulp.task('cache', function () {
  return cache.clearAll()
})

gulp.task('build', function () {
  gulp.series('clean', 'cache', 'fonts', 'images', 'useref', 'sass', 'browserSync')();
})

gulp.task('watch', function () {
  gulp.series('fonts', 'images', 'useref', 'browserSync')();

  gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('app/*.html', browserSync.reload);
})