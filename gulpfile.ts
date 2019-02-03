const gulp = require('gulp');

gulp.task('front', function () {

  return gulp.src('./dist/**/*')
    .pipe(gulp.dest('./build/public'));
});

gulp.task('clean', function () {

  return gulp.src('./dist/**/*')
    .pipe(gulp.dest('./build/public'));
});


// gulp.task('default',  gulp.series('copydist'));



