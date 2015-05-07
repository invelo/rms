'use strict';

module.exports = function(grunt) {

  var fs = require('fs');
  var moment = require('moment');

  grunt.initConfig({

    today: moment().utcOffset(-7),
    args: require('minimist')(process.argv.slice(2)),
    banner: fs.readFileSync('banner.js', { encoding: 'utf8' }),
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      release: {
        files: [
          {
            expand: true,
            src: ['**'],
            cwd: 'tmp/',
            dest: 'dist/<%= pkg.version %>'
          },
          {
            expand: true,
            src: ['**'],
            cwd: 'tmp/',
            dest: 'dist/latest'
          }
        ]
      }
    },
    browserify: {
      dist: {
        opts: {
        },
        files: {
          'tmp/rms.full.js': [
            'lib/client.js'
          ]
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        commit: false,
        createTag: false,
        updateConfigs: ['pkg'],
        push: false
      }
    },
    uglify: {
      options: {
        //banner: null,
        sourceMap: true,
        sourceMapName: 'tmp/rms.map',
        mangle: { except: [] },
        preserveComments:false,
        compress: {
          sequences     : true,
          properties    : true,
          dead_code     : false,
          drop_debugger : true,
          unsafe        : false,
          conditionals  : true,
          drop_console  : true,
          comparisons   : true,
          evaluate      : true,
          booleans      : true,
          loops         : true,
          unused        : false,
          hoist_funs    : true,
          hoist_vars    : true,
          if_return     : true,
          join_vars     : true,
          cascade       : false,
          side_effects  : false,
          warnings      : true,
          global_defs: {}
        }
      },
      dist: {
        files: {
          'tmp/rms.js': ['tmp/rms.full.js']
        }
      }
    },
    clean: {
      all: ['tmp']
    },
    usebanner: {
      good: {
        options: {
          position: 'top',
          banner: "<%= banner %>",
          linebreak: true
        },
        files: {
          src: [ 'tmp/rms.js','tmp/rms.full.js' ]
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify','uglify','usebanner','copy','clean']);
};
