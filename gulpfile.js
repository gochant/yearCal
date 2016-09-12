var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('script', function() {
    return gulp.src(['./src/js/lunar.js', './src/js/index.js'])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('style', function(){
    return gulp.src('./src/less/index.css')
        .pipe(gulp.dest('./dist/'))
})

gulp.task('default', ['script', 'style']);