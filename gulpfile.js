var path = require('path'),
    gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    gulpRimraf = require('gulp-rimraf'),
    gulpSequence = require('gulp-sequence'),
    gulpUseref = require('gulp-useref'),
    gulpSwig = require('gulp-swig'),
    gulpImagemin = require('gulp-imagemin'),
    gulpUglify = require('gulp-uglify'),
    gulpStripComments = require('gulp-strip-comments'),
    gulpCleanCss = require('gulp-clean-css'),
    gulpHtmlMin = require('gulp-htmlmin'),
    lazypipe = require('lazypipe'),
    sass = require('gulp-sass'),
    _ = require('lodash'),
    fs = require('fs'),
    config = {
        root: {
            src: './src',
            dist: './dist'
        },

        html: {
            src: './',
            files: '*.html'
        },

        img: {
            src: './images/**/',
            files: '*.*',
            dist: './images/'
        },

        fonts: {
            src: './styles/fonts/**/',
            files: '*.*',
            dist: './styles/fonts'
        },

        data: {
            src: './data/**/',
            files: '*.*',
            dist: './data'
        },

        copyMisc: {
          files: 'CNAME'
        }
    },
    data = {
        organizersData: organizersWithGroup(),
        eventsData: getEventsData()
    };

function organizersWithGroup() {
    var data = require('./src/templates/data.json');
    var groupTypes = data.groups;

    return data.organizers.map(function (organizer) {
        var personsByGroups = _.groupBy(data.persons[organizer.id], "groupId");
        var formattedGroups = _.toPairs(personsByGroups).map(function (group) {
            var zipGroup = _.zipObject(["groupId", "persons"], group);
            var groupData = _.find(groupTypes, {id: parseInt(zipGroup.groupId)});

            return {
                groupData: groupData,
                persons: zipGroup.persons
            };
        });

        return {
            orgData: organizer,
            groups: formattedGroups
        }
    });
}

function getEventsData() {
    var events = require('./src/templates/winners.json'),
        participants = require('./src/templates/participants.json');

    return events.map(function(event) {

        var people = _.filter(participants, function(participant) {
            return _.includes(event.winnersIds, participant.id);
        });

        var participantsTable = event.participantsTable ? event.participantsTable.map(function(item) {
            return {
                data: _.find(participants, { id: item[0] }),
                js: item[1],
                css: item[2]
            }
        }) : [];

        return new EventData(people, event, participantsTable);

    });
}

function EventData(participants, event, participantsTable) {
    var that = {};

    that.participants = participants;
    that.date = event.date;
    that.text = event.text;
    that.participantsTable = participantsTable;
    that.photos = getEventPhotos(event.photos);

    return that;

    function getEventPhotos(photosPath) {
        var photos = fs.readdirSync(path.join(config.root.src, photosPath));

        photos = photos.map(function(photo) {
            return path.join(photosPath, photo).split(path.sep).join('/');
        });

        return photos;
    }
}

function minCondition(type) {

    return function (file) {

        var fileData = path.parse(file.path),
            fileExt = fileData.ext.replace('.', ''),
            minRegexp = new RegExp('\.min$');

        return !!(fileExt === type && !minRegexp.test(fileData.name));
    };
}

gulp.task('clean', function() {
    return gulp.src(path.join(config.root.dist, "**", "*.*"))
        .pipe(gulpRimraf());
});

gulp.task('html', function() {
        return gulp.src(path.join(config.root.src, config.html.src, config.html.files))
            .pipe(gulpSwig({data: data}))
            .pipe(gulpUseref({},
                lazypipe().pipe(
                    function() {
                        return gulpIf(minCondition('js'), gulpUglify());
                    }
                ),
                lazypipe().pipe(
                    function() {
                        return gulpIf('*.scss', sass());
                    }
                ),
                lazypipe().pipe(
                    function() {
                        return gulpIf(minCondition('css'), gulpCleanCss());
                    }
                )
            ))
            .pipe(gulpIf('*.js', gulpStripComments()))
            .pipe(gulpIf('*.css', gulpStripComments.text({ignore: /url\([\w\s:\/=\-\+;,]*\)/g})))
            .pipe(gulpIf('*.html', gulpHtmlMin({
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true
            })))
            .pipe(gulp.dest(config.root.dist));
});

gulp.task('img', function() {
    return gulp.src(path.join(config.root.src, config.img.src, config.img.files))
        .pipe(gulpIf('!*.svg', gulpImagemin({progressive: true})))
        .pipe(gulp.dest(path.join(config.root.dist, config.img.dist)))
});

gulp.task('fonts', function() {
    return gulp.src(path.join(config.root.src, config.fonts.src, config.fonts.files))
        .pipe(gulp.dest(path.join(config.root.dist, config.fonts.dist)))
});

gulp.task('data', function() {
    return gulp.src(path.join(config.root.src, config.data.src, config.data.files))
        .pipe(gulp.dest(path.join(config.root.dist, config.data.dist)))
});

gulp.task('copy-misc', function() {
    return gulp.src(path.join(config.root.src, config.copyMisc.files))
        .pipe(gulp.dest(config.root.dist))
});

gulp.task('default', function (cb) {
    gulpSequence('clean', ['html', 'img', 'fonts', 'data', 'copy-misc'], cb);
});
