var gulp = require('gulp');
var twig = require('gulp-twig');

gulp.task('compile', function () {
    return gulp.src(['./src/**/*.twig', '!./src/base.twig', '!./src/macros.twig', '!./src/**/_*.twig'])
        .pipe(twig())
        .pipe(gulp.dest('./'));
});

gulp.watch('./src/**/*.twig', ['compile']);

gulp.task('default', ['compile']);