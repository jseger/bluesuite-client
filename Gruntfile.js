module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    npm_run_build: {
      cmd: 'node',
      args: [
        'build/build.js'
      ]
    }
  });

  // Load the plugin that provides the "grunt_run" task.
  grunt.loadNpmTasks('grunt-run');

  // Default task(s).
  grunt.registerTask('default', ['run:npm_run_build']);

};