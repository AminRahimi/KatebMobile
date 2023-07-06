var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngTemplate = require('gulp-ng-template'),
    cleanCSS = require('gulp-clean-css'),
    gulpFn  = require('gulp-fn'),
    del = require('del');

var directives = [];
var noneDirectives = [];

gulp.task('listOfJSFiles', function () {
	return gulp.src(['app/lib/vtSchemaDirective/**/*.js'])
	.pipe(gulpFn(function(file) {
		if (file.path.indexOf('Directive.js') != -1) {
			directives.push(file.path);
		} else {
			noneDirectives.push(file.path);
		}
    }))
});

gulp.task('createTemplatecash', function () {
		return gulp.src('app/lib/vtSchemaDirective/**/*.html')
	    .pipe(ngTemplate({
	    	moduleName: 'schemaForm',
	    	filePath: 'templatecash.js',
	    	prefix: 'app/lib/vtSchemaDirective/'
		}))
	    .pipe(gulp.dest('app/lib/vtSchemaDirective/dist'));
});

gulp.task('createCSS', function () {
	return gulp.src('app/lib/vtSchemaDirective/**/*.css')
    .pipe(concat('style.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('app/lib/vtSchemaDirective/dist'));
});

gulp.task('concatJSFiles', ['createCSS', 'createTemplatecash', 'listOfJSFiles'], function () {
	var jsConcat = directives.concat(noneDirectives);
	return gulp.src(jsConcat)
	    .pipe(concat('concat.js'))
	    .pipe(gulp.dest('app/lib/vtSchemaDirective/dist'));
});

gulp.task('finalConcat', ['concatJSFiles'], function () {
	return gulp.src(['app/lib/vtSchemaDirective/dist/concat.js', 'app/lib/vtSchemaDirective/dist/templatecash.js'])
	    .pipe(concat('featureCM.js'))
//	    .pipe(uglify())
	    .pipe(gulp.dest('app/lib/vtSchemaDirective/dist'));
});

gulp.task('deleteFiles', ['finalConcat'], function () {
	return del(['app/lib/vtSchemaDirective/dist/concat.js', 'app/lib/vtSchemaDirective/dist/templatecash.js']);
});

gulp.task('featureCM', ['deleteFiles']);
