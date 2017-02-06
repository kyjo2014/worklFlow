// install module
let gulp = require('gulp')
// let webpack = require('webpack-stream')
let zip = require('gulp-zip')
let qn = require('gulp-qn')
let sftp = require('gulp-sftp')
let exec = require('child_process').exec
let fs = require('fs')
let iconfont = require('gulp-iconfont')

// config
let qnConfig = require('./cdnpass.json')
// let serverConfig = require('./ftppass.json')



/**
 *调用该任务需要使用额外参数  --projectname
 * 未完善
 */
gulp.task('mktemplate', () => {
    console.log(process.argv.slice(-2))
    if (process.argv.slice(-2, -1) == '--projectname') {
        return new Promise(() => {
            let curWork = exec(`vue init webpack ${process.argv.slice(-1)}`, (err, stdout, stderr) => {
                // console.log(stdout)
            })
            process.stdin.pipe(curWork.stdin)
            curWork.stdout.pipe(process.stdout)
            // curWork.stdin.write('y\n')
        })
    }
    console.log()

})

gulp.task('default', [], () => {
    return gulp.src()
})

gulp.task('dev', () => {
    return new Promise((reslove, reject) => {
        exec('node build/dev-server.js', (err, stdout, stderr) => {
            if (err) {
                reject(err)
                throw err
            }
            console.log(stdout);
            reslove(stdout)
        })
    })
})

gulp.task('backup', () => {
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }

    var d = new Date();
    var year = d.getFullYear();
    var month = checkTime(d.getMonth() + 1);
    var day = checkTime(d.getDate());
    var hour = checkTime(d.getHours());
    var minute = checkTime(d.getMinutes());

    return gulp.src('./dist/**')
        .pipe(zip(config.project + '-' + year + month + day + hour + minute + '.zip'))
        .pipe(gulp.dest('./'));
})


gulp.task('uploadCDN', () => {
    return gulp.src('./dist/**')
        .pipe(qn({
            qiniu: qnConfig
        }))
})


gulp.task('uploadServe', () => {
    return gulp.src('./dist/**')
        .pipe(sftp(serverConfig))
})

var runTimestamp = Math.round(Date.now() / 1000);

gulp.task('Iconfont', () => {
    return gulp.src(['./resource/svg/*.svg'])
        .pipe(iconfont({
            fontName: 'myfont', // required 
            prependUnicode: true, // recommended option 
            formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available 
            timestamp: runTimestamp, // recommended to get consistent builds when watching files 
        }))
        .on('glyphs', function (glyphs, options) {
            // CSS templating, e.g. 
            console.log(glyphs, options);
        })
        .pipe(gulp.dest('./src/assets/font/'));
});