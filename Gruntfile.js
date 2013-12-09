module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: ["Gruntfile.js", "app.js", "public/**.js", "package.json"]
    },
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, cwd: "bower_components/", src: ["backbone/backbone.js","underscore/underscore.js"], dest: "js/lib/"}
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.registerTask("default", ["jshint", "copy"]);
  grunt.registerTask("onInstall", ["copy"]);
};
