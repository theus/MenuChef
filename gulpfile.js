var gulp = require('gulp');
var twig = require('gulp-twig');
var collect = require('collect.js');
var fs = require('fs');
var exec = require('child_process').exec;
var importFresh = require('import-fresh');
var slugg = require('slugg');

const version = importFresh('./package.json').version;

gulp.task('compile', function () {
  let docjson = collect(importFresh('./doc.json'))
  let doc = {}

  doc.constructor = docjson.where('name', 'constructor').all()
  doc.options = docjson.where('name', 'options').all()
  doc.theme = docjson.where('name', 'theme').all()
  doc.public_methods = docjson.where('name', 'public_methods').all()
  doc.public_variables = docjson.where('name', 'public_variables').all()

  return gulp.src(['./site/**/*.twig', '!./site/base.twig', '!./site/macros.twig', '!./site/**/_*.twig'])
      .pipe(twig({
          data: {
            doc: doc,
            version: version
          },
          functions: [
            {
              name: "json",
              func: function (obj) {
                  return JSON.stringify(obj);
              }
            },
            {
              name: "search",
              func: function (arr, key, val) {
                  return arr.filter(item => item[key] == val)[0];
              }
            },
            {
              name: "label",
              func: function (type) {
                  let types = type.split(',')
                  let content = []
                  const tag = (type) => `<span class="label label-default label--${type.trim()}">${type.trim()}</span>`

                  types.forEach(type => content.push(tag(type)))
                  return content.join(' ');
              }
            }
          ],
          filters: [
            {
              name: 'slugify',
              func: function (str) {
                return slugg(str)
              }
            }
          ]
        }))
      .pipe(gulp.dest('./'));
});

gulp.task('doc', function () {
  exec('npm run doc:generate');
});

gulp.task('watch', function () {
  gulp.watch('./site/**/*.twig', ['compile']);
  gulp.watch('./site/src/**/*', ['doc']);
  gulp.watch('./doc.json', ['compile']);
});


gulp.task('default', ['doc' ,'compile']);
gulp.task('dev', ['default' ,'watch']);