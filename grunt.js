/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>*/'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js']//, 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        plusplus: true,
        smarttabs:true
      },
      globals: {
        bucefalo: true,
        console: true,
        require: true,
        module: true,
        __dirname: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint');

};
