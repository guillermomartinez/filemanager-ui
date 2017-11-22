
module.exports = function(grunt) {

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
      css: {
        src: [
          'bower_components/fancybox/source/jquery.fancybox.css',
          'bower_components/dropzone/dist/dropzone.css',
          'src/css/bootstrap.css',
          'src/css/main.css',
          'src/css/responsive.css'
        ],
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      css2: {
        src: [
          'bower_components/fancybox/source/jquery.fancybox.css',
          'bower_components/dropzone/dist/dropzone.css',
          'src/css/main.css',
          'src/css/responsive.css'
        ],
        dest: 'dist/css/<%= pkg.name %>-without.css'
      },
      js_build: {
        src: [
          'bower_components/bootstrap/js/transition.js',
          'bower_components/bootstrap/js/alert.js',
          'bower_components/bootstrap/js/button.js',
          //'bower_components/bootstrap/js/carousel.js',
          //'bower_components/bootstrap/js/collapse.js',
          'bower_components/bootstrap/js/dropdown.js',
          'bower_components/bootstrap/js/modal.js',
          'bower_components/bootstrap/js/tooltip.js',
          'bower_components/bootstrap/js/popover.js',
          //'bower_components/bootstrap/js/scrollspy.js',
          //'bower_components/bootstrap/js/tab.js',
          //'bower_components/bootstrap/js/affix.js',
        ],
        dest: 'src/js/bootstrap.js'
      },
      js: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'src/js/bootstrap.js',
          'bower_components/jquery-validation/dist/jquery.validate.js',
          'bower_components/dropzone/dist/dropzone.js',
          'bower_components/fancybox/source/jquery.fancybox.js',
          'bower_components/moment/moment.js',
          'bower_components/bootstrap-contextmenu/bootstrap-contextmenu.js',
          'bower_components/jquery-lazy/jquery.lazy.js',
          'src/js/languaje/us.js',
          'src/js/languaje/ru.js',
          'src/js/languaje/es.js',
          'src/js/languaje/zh.js',
          'src/js/languaje/fr.js',
          'src/js/jquery.filemanager.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      js2: {
        src: [
          'bower_components/jquery-validation/dist/jquery.validate.js',
          'bower_components/dropzone/dist/dropzone.js',
          'bower_components/fancybox/source/jquery.fancybox.js',
          'bower_components/moment/moment.js',
          'bower_components/bootstrap-contextmenu/bootstrap-contextmenu.js',
          'bower_components/jquery-lazy/jquery.lazy.js',
          'src/js/languaje/us.js',
          'src/js/languaje/ru.js',
          'src/js/languaje/es.js',
          'src/js/languaje/zh.js',
          'src/js/languaje/fr.js',
          'src/js/jquery.filemanager.js'
        ],
        dest: 'dist/js/<%= pkg.name %>-without.js'
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
      },
      minifyCore2: {
        src: 'dist/css/<%= pkg.name %>-without.css',
        dest: 'dist/css/<%= pkg.name %>-without.min.css'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      core: {
        src: 'dist/js/<%= pkg.name %>.js',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      core2: {
        src: 'dist/js/<%= pkg.name %>-without.js',
        dest: 'dist/js/<%= pkg.name %>-without.min.js'
      }
    },
    copy: {
      fonts_build: {
      	expand: true,
        src: 'bower_components/bootstrap/dist/fonts/**',
        dest: 'src/fonts/',
        flatten: true,
        filter: 'isFile'
      },
      fancybox_build: {
        expand: true,
        src: ['bower_components/fancybox/source/*.png','bower_components/fancybox/source/*.gif'],
        dest: 'src/css/',
        flatten: true,
        filter: 'isFile'
      },
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
    watch: {
      files: ['src/css/*.css','src/js/*.js'],
      tasks: ['dist']
    }
	});

	require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  grunt.registerTask('build', ['less', 'concat:js_build','copy:fonts_build','copy:fancybox_build']);
  grunt.registerTask('dist', ['clean','less', 'concat:css', 'concat:css2', 'concat:js', 'concat:js2', 'cssmin:minifyCore', 'cssmin:minifyCore2', 'uglify:core','uglify:core2','copy:fonts','copy:fancybox','copy:images']);


};