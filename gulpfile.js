var gulp = require('gulp');
var twig = require('gulp-twig');
const version = require('./package.json').version

gulp.task('compile', function () {
    return gulp.src(['./src/**/*.twig', '!./src/base.twig', '!./src/macros.twig', '!./src/**/_*.twig'])
        .pipe(twig({
            data: {
              version: version
            }
          }))
        .pipe(gulp.dest('./'));
});

gulp.watch('./src/**/*.twig', ['compile']);

gulp.task('default', ['compile']);