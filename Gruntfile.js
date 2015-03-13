
module.exports = function(grunt) {
	// grunt.registerTask('default', ['less:compileCore']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
      dist: 'dist'
    },
	 	less: {
			compileCore: {
				// options: {
				//   strictMath: true,
				//   sourceMap: true,
				//   outputSourceFiles: true,
				//   sourceMapURL: '<%= pkg.name %>.css.map',
				//   sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
				// },
				src: 'src/css/bootstrap.less',
				dest: 'src/css/bootstrap.css'
			}
		},
    concat: {
      dist: {
        src: [
          'bower_components/fancybox/source/jquery.fancybox.css',
          'bower_components/dropzone/dist/dropzone.css',
          'src/css/bootstrap.css',
          'src/css/main.css'
        ],
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      bootstrap: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/bootstrap/js/transition.js',
          'bower_components/bootstrap/js/alert.js',
          'bower_components/bootstrap/js/button.js',
          'bower_components/bootstrap/js/carousel.js',
          'bower_components/bootstrap/js/collapse.js',
          'bower_components/bootstrap/js/dropdown.js',
          'bower_components/bootstrap/js/modal.js',
          'bower_components/bootstrap/js/tooltip.js',
          'bower_components/bootstrap/js/popover.js',
          'bower_components/bootstrap/js/scrollspy.js',
          'bower_components/bootstrap/js/tab.js',
          'bower_components/bootstrap/js/affix.js',
          'bower_components/jquery-validation/dist/jquery.validate.js',
          'bower_components/dropzone/dist/dropzone.js',
          'bower_components/fancybox/source/jquery.fancybox.js',
          'bower_components/moment/moment.js',
          'src/js/languaje/us.js',
          'src/js/languaje/es.js',
          'src/js/jquery.filemanager.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      core: {
        src: 'dist/js/<%= pkg.name %>.js',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }      
    },
		cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        advanced: false
      },
      minifyCore: {
        src: 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.min.css'
      }      
    },
    copy: {
      fonts: {
      	expand: true,
        src: 'bower_components/bootstrap/dist/fonts/**',
        dest: 'dist/fonts/',
        flatten: true,
        filter: 'isFile'
      },
      fancybox: {
        expand: true,
        src: ['bower_components/fancybox/source/*.png','bower_components/fancybox/source/*.gif'],
        dest: 'dist/css/',
        flatten: true,
        filter: 'isFile'
      },
      images: {
        expand: true,
        src: 'src/images/**',
        dest: 'dist/images/',
        flatten: true,
        filter: 'isFile'
      }
    },
	});

	// grunt.loadNpmTasks('grunt-contrib-less');
	require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  grunt.registerTask('less-compile', ['less:compileCore']);
  grunt.registerTask('dist-css', ['clean','less-compile', 'concat', 'cssmin:minifyCore','uglify:core','copy']);


};