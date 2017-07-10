var gulp = require('gulp');
var twig = require('gulp-twig');
const version = require('./package.json').version

gulp.task('compile', function () {
    return gulp.src(['./site/**/*.twig', '!./site/base.twig', '!./site/macros.twig', '!./site/**/_*.twig'])
        .pipe(twig({
            data: {
              version: version
            }
          }))
        .pipe(gulp.dest('./'));
});

gulp.watch('./site/**/*.twig', ['compile']);

gulp.task('default', ['compile']);