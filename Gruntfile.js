module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: [
        "Gruntfile.js",
        "app.js",
        "public/**.js",
        "package.json"
      ]
    },
    compass: {
      dev: {
        options: {
          sassDir: 'scss',
          cssDir: 'css',
          imagesDir: 'img',
          javascriptsDir: 'js',
          fontsDir: 'fonts',
          // outputStyle can be: nested, expanded, compact, compressed
          outputStyle: 'compressed',
          relativeAssets: true
        }
      },
    },
    copy: {
      main: {
        files: [{
          expand: true,
          flatten: true,
          cwd: "bower_components/",
          src: ["backbone/backbone.js",
            "underscore/underscore.js",
            "handlebars/handlebars.js"
          ],
          dest: "js/lib/"
        }]
      }
    },
    clean: {
      css: {
        src: ["css"]
      }
    },
    watch: {
      compass: {
        files: 'scss/{,*/}*.{scss,sass}',
        tasks: ['clean:css', 'compass'],
        options: {
          interrupt: true,
        },
      },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask("default", ["jshint", "copy"]);
  grunt.registerTask("onInstall", ["copy"]);
  grunt.registerTask("scss", ["compass", "watch:compass"]);
};