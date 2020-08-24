import gulp from 'gulp';
import util from 'gulp-util';
import sass from 'gulp-sass';
import connect from 'gulp-connect';
import clean from 'gulp-clean';
import yargs from 'yargs';
import runSequence from 'run-sequence';
import sourcemaps from 'gulp-sourcemaps';
import IF from 'gulp-if';
import concat from 'gulp-concat';
import cors from 'cors';
import plumber from 'gulp-plumber';
import replace from 'gulp-replace';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';

const args = yargs.argv;
const buildDir = 'build';
const version = process.env.npm_package_version || 'latest';
const releaseDir = `${buildDir}/${version}`;

util.log(`Building ${releaseDir}`);
gulp.task('build:clean', () =>
  gulp
    .src([releaseDir], { read: false })
    .pipe(clean())
);

gulp.task('build:scss', () =>
  gulp
    .src('src/ui.scss')
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end')
      },
    }))
    .pipe(sass({
      outputStyle: 'compressed',
      precision: 13
    }))
    // Devicons does not allow to specify the font path using a variable,
    // so we need to replace it
    .pipe(replace(/\.\.\/fonts\/devicons/g, './fonts/devicons'))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(releaseDir))
);

gulp.task('build:fonts', () =>
  gulp
    .src([
      'node_modules/font-awesome/fonts/*',
      'node_modules/devicons/fonts/*'
    ])
    .pipe(gulp.dest(`${releaseDir}/fonts`))
);

gulp.task('build:assets', () =>
  gulp
    .src([
      'src/assets/**'
    ])
    .pipe(gulp.dest(`${releaseDir}/assets`))
);


gulp.task('watch:scss', () => gulp.watch('src/**/*.scss', ['build:scss']));

gulp.task('watch', () => runSequence('watch:scss'));

gulp.task('serve', connect.server({
  root: [buildDir],
  port: 8042,
  middleware() {
    return [
      cors()
    ];
  }
})
);

gulp.task('nulltask', () => true);

gulp.task('default', () =>
  runSequence(
    'build:clean',
    [
      'build:scss',
      'build:fonts',
      'build:assets',
    ],
    'watch',
    'serve'
  )
);

gulp.task('build', () =>
  runSequence(
    'build:clean',
    [
      'build:scss',
      'build:fonts',
      'build:assets',
    ]
  )
);
