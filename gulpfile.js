/**
 * Created by yqz on 2016/2/18.
 */

var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var miniCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imageMin = require('gulp-imagemin');
var spriteSmith = require('gulp.spritesmith');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var __PROD__ = process.env.NODE_ENV == 'product';
var __DEV__ = !__PROD__;


// handle sass
gulp.task('sass', function () {
    var cssDir = path.resolve(__dirname, 'build/stylesheets');
    var r = sass('./src/stylesheets/shop.scss', {compass: true})
        .pipe(rename('bundles.css'));
    if (__PROD__) {
        r = r.pipe(miniCss())
    }
    return r.pipe(gulp.dest(cssDir))
        .pipe(reload({stream: true}));
});


//handle spritesmith
gulp.task('sprites', function () {
    gulp.src('./src/sprites/*')
        .pipe(spriteSmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            padding: 5
        }))
        .pipe(gulp.dest('./build/sprites'));
});

//handle image
gulp.task('images', function () {
    var imageDir = path.resolve(__dirname, 'build/images');
    gulp.src('./src/images/*')
        .pipe(imageMin())
        .pipe(gulp.dest(imageDir));
});


gulp.task('basejs', function () {
    var jsDir = path.resolve(__dirname, 'build/javascripts')
    gulp.src('./src/javascripts/plugins/*/*.js')
        .pipe(concat('base.js'))
        .pipe(gulp.dest(jsDir));
});

gulp.task('vendorjs', function () {
    var jsDir = path.resolve(__dirname, 'build/javascripts')
    gulp.src('./src/javascripts/vendors/*.js')
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(jsDir));
});

gulp.task('default', function () {
    browserSync.init({
        server: "./build"
    });
    gulp.start('basejs', 'vendorjs', 'sass', 'sprites', 'images', 'watch');
});


//listening
gulp.task('watch', function () {
    gulp.watch('./src/sprites/*', ['sprites']);
    gulp.watch('./src/images/*', ['images']);
    gulp.watch(['./src/stylesheets/*', './src/stylesheets/*/*', './src/stylesheets/*/*/*'], ['sass']);
    gulp.watch('./build/*.html').on('change', reload);
    gulp.watch('./src/javascripts/plugins/*/*.js', ['basejs'])
    gulp.watch('./src/javascripts/vendors/*.js', ['vendorjs'])
});