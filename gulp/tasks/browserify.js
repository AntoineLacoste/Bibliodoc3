var browserify   = require('browserify');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var config = require('../util/config').browserify;
var reactify=require('reactify');
var watchify = require('watchify');
var bundleLogger= require('../util/bundleLogger');


//gulp.task('browserify', function(){
//
//var tot=config.bundleConfigs();
//    console.log("%o",tot);
//    // TODO maybe it's worth trying to integrate watchify
//    return browserify({
//        entries: config.bundleConfigs().entries,
//        extensions: ['.jsx'],
//        paths: ['./node_modules','./src/js/']
//    })
//        .transform('reactify')
//        .bundle({debug: true})
//        .on('error', handleErrors)
//        .pipe(source('global.app.js'))
//        .pipe(gulp.dest('./www'));
//
//});


//// TACHE BROWSERIFY FONCTIONNELLE MULTI BUNDLE
gulp.task('browserify', function (callback) {

    var bundleQueue = config.bundleConfigs().length;

    var browserifyThis = function (bundleConfig) {

        var bundler = browserify({
            // Required watchify args
            cache: {}, packageCache: {}, fullPaths: true,
            // Specify the entry point of your app
            entries: bundleConfig.entries,
            // Add file extentions to make optional in your requires
            extensions: config.extensions,
            // Enable source maps!
            debug: config.debug
        });
        bundler.transform({es6: true}, reactify);

        //// Optimisation des libs en external
        //libs.forEach(function (lib) {
        //    bundler.external(lib);
        //});

        var bundle = function () {
            // Log when bundling starts
            bundleLogger.start(bundleConfig.outputName);

            var stream = bundler
                .bundle()
                // Report compile errors
                .on('error', handleErrors)
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specifiy the
                // desired output filename here.
                .pipe(source(bundleConfig.outputName));
            if (!config.debug) {
                // If this is a production build, minify it
                //stream.pipe(uglify()); TODO : voir issues
            }
            // Specify the output destination
            stream.pipe(gulp.dest(bundleConfig.dest))
                .on('end', reportFinished);

            return stream;
        };

        var reportFinished = function () {
            // Log when bundling completes
            bundleLogger.end(bundleConfig.outputName)

            if (bundleQueue) {
                bundleQueue--;
                if (bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        // Wrap with watchify and rebundle on changes
        bundler = watchify(bundler);
        // Rebundle on update
        bundler.on('update', bundle);

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    config.bundleConfigs().forEach(browserifyThis);
});