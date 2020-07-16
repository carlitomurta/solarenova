const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const useref = require('gulp-useref')
const cssnano = require('gulp-cssnano')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const del = require('del')
const csso = require('gulp-csso')

function clean(cb) {
  del.sync('dist')
  console.log('dist folder deleted')
  cb()
}

function css(cb) {
  gulp
    .src('app/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(csso())
    .pipe(gulpif('.css', cssnano()))
    .pipe(rename({ basename: 'style', extname: '.min.css' }))
    .pipe(gulp.dest('dist'))
  console.log('css processed')
  cb()
}

function javascript(cb) {
  gulp
    .src('app/js/**/*.js')
    .pipe(babel())
    .pipe(gulp.src('vendor/*.js'))
    .pipe(gulpif('.js', uglify()))
    .pipe(rename({ basename: 'main', extname: '.min.js' }))
    .pipe(gulp.dest('dist'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    )
  console.log('js processed')
  cb()
}

function images(cb) {
  gulp
    .src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(
      cache(
        imagemin({
          // Setting interlaced to true for GIFs
          interlaced: true,
        })
      )
    )
    .pipe(gulp.dest('dist/images'))
  console.log('images processed')
  cb()
}

function fonts(cb) {
  gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'))
  console.log('fonts processed')
  cb()
}

function useIndex(cb) {
  gulp.src('app/*.html').pipe(useref()).pipe(gulp.dest('dist'))
  console.log('useIndex processed')
  cb()
}

function serve(cb) {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
  })
  console.log('serve processed')
  cb()
}

function watch() {
  gulp
    .watch('app/**/*.html', { events: 'all' }, useIndex)
    .on('change', browserSync.reload)
  gulp
    .watch('app/scss/**/*.scss', { events: 'all' }, css)
    .on('change', browserSync.reload)
  gulp
    .watch('app/js/**/*.js', { events: 'all' }, javascript)
    .on('change', browserSync.reload)
}

exports.default = gulp.series(images, fonts, serve, watch)

exports.build = gulp.series(
  clean,
  gulp.parallel(css, javascript),
  useIndex,
  images,
  fonts
)

exports.clean = gulp.series(clean)
