import * as gulp from 'gulp';
import gulpTsLint from 'gulp-tslint';
import * as tslint from 'tslint';
import * as project from '../aurelia.json';

export default function lint() {
  const program = tslint.Linter.createProgram("./tsconfig.json");
  return gulp.src([project.transpiler.source])
    .pipe(gulpTsLint({
      tslint: tslint,
      formatter: 'prose',
      program: program
    }))
    .pipe(gulpTsLint.report());
}
