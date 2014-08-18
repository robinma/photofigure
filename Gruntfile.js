module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            videoplayer:{
                src:['src/js/photofigure.js',
                'src/js/preOnloadImgSize.js',
                'src/js/resetImgSize.js',
                'src/js/rotate.js',
                'src/js/mousedrag.js'
                ],
                dest:'build/photofigure.js'
            }
        },
        uglify: {
            videoplayer:{
                src:['build/photofigure.js'],
                dest:'build/photofigure.min.js',
                banner:''
            }
        },
        cssmin: {
            build: {
                src  : ['src/css/photofigure.css'],
                dest : 'build/css/photofigure.min.css'
            }
        },
        copy: {
            build: {
                expand  : true,
                cwd     : 'src/',
                src     : ['*/*.*','!js/*.*','!scss/*.*','!css/*.*'],
                dest    : 'build/',
               // flatten : true,
               filter  : 'isFile'
            }
        },
        sass:{
            dist:{
                values:'compressed',
                files:{
                    "src/css/photofigure.css":"src/scss/photofigure.scss"
                }
            }
        },
        watch:{
            // css:{
            //     files:['src/css/videoplayer.css'],
            //     tasks:['cssmin']
            // },
            // js:{
            //     files:['src/js/*.*'],
            //     tasks:['concat', 'uglify', 'copy']
            // }
            scss:{
                files:['src/scss/*/*.*'],
                tasks:['sass']
            }
        }
    });


    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('watchfile', ['watch']);




};