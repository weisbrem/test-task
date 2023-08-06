const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();

const htmlmin = require("gulp-htmlmin");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const terser = require("gulp-terser");
const webp = require("gulp-webp");
const avif = require("gulp-avif");
const del = require("del");
const imagemin = require("gulp-imagemin");

// styles

const styles = () => {
  return gulp
    .src("src/css/style.css")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// HTML

const html = () => {
  return gulp
    .src("src/index.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

// scripts

const scripts = () => {
  return gulp
    .src("src/js/app.js")
    .pipe(terser())
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest("build/js"));
};

exports.scripts = scripts;

// optimaze images

const optimizeImages = () => {
  return gulp
    .src("src/img/**/*.{png, jpg, svg}")
    .pipe(
      imagemin([
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest("build/img"));
};

exports.optimizeImages = optimizeImages;

const copyImages = () => {
  return gulp.src("src/img/**/*.{png,svg}").pipe(gulp.dest("build/img"));
};

exports.copyImages = copyImages;

// create webP

const createWebp = () => {
  return gulp
    .src("src/img/**/*.{png, jpg}")
    .pipe(
      webp({
        quality: 90,
      })
    )
    .pipe(gulp.dest("build/img"));
};

exports.createWebp = createWebp;

// create avif

const createAvif = () => {
  return gulp
    .src("src/img/**/*.{png, jpg}")
    .pipe(
      avif({
        quality: 90,
      })
    )
    .pipe(gulp.dest("build/img"));
};

exports.createAvif = createAvif;

// sprite

const sprite = () => {
  return gulp
    .src("src/img/*.svg")
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

exports.sprite = sprite;

// copy

const copy = (done) => {
  gulp
    .src(
      ["src/fonts/*.{woff2,woff}", "src/*.ico", "src/manifest.webmanifest"],
      {
        base: "src",
      }
    )
    .pipe(gulp.dest("build"));
  done();
};

exports.copy = copy;

// clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

// server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// watcher

const watcher = () => {
  gulp.watch("src/css/style.css", gulp.series("styles"));
  gulp.watch("src/js/app.js", gulp.series(scripts));
  gulp.watch("src/index.html").on("change", sync.reload);
};

// build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(styles, html, scripts, sprite, createWebp, createAvif)
);

exports.build = build;

// default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(styles, html, scripts, sprite, createWebp, createAvif),
  gulp.series(server, watcher)
);
