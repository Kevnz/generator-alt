'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path  = require('path');

var Packages = {
  main:  [
    'alt',
    'debug',
    'es6-shim',
    'react',
    'react-router',
    'whatwg-fetch'
  ],
  dev: [
    'autoprefixer-loader',
    'babel-core',
    'babel-loader',
    'css-loader',
    'file-loader',
    'html-webpack-plugin',
    'node-libs-browser',
    'react-hot-loader',
    'style-loader',
    'webpack',
    'webpack-dev-server'
  ]
};


module.exports = yeoman.generators.Base.extend({

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'React.js' + chalk.red(' ❤ ') + ' Alt  '
    ));
    this.log(chalk.magenta(
      'Out of the box I include React.js, react-router, Alt, all backed by webpack to build your app.'
    ));

    var root = this.destinationPath();

    var prompts = [
      {
        name: 'app',
        message: 'What\'s the name of the app?',
        default: path.basename(root)
      },
      {
        name: 'preprocessor',
        message: 'How\'d you like to pre-process stylesheets? (Less|Sass)',
        default: 'Sass'
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      this.app = props.app;
      // pre-processor for style sheets.
      if (props.preprocessor.toLowerCase() === 'less') {
        this.preprocessor = { name: 'less', ext: '/\.less$/' };
      } else {
        this.preprocessor = { name: 'sass', ext: '/\.scss$/' };
      }
      done();
    }.bind(this));
  },

  installApp: function() {
    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath('index.html')
    );
    this.fs.copy(
      this.templatePath('scripts'),
      this.destinationPath('scripts')
    );
  },

  installAssets: function() {
    this.fs.copy(
      this.templatePath('assets'),
      this.destinationPath('assets')
    );
  },

  finalize: function() {
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      { preprocessor: this.preprocessor }
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { app: this.app }
    );

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
  },

  install: function () {
    if (this.preprocessor.name === 'less') {
      Packages.dev.push('less-loader');
    } else {
      Packages.dev.push('node-sass');
      Packages.dev.push('sass-loader');
    }

    this.npmInstall(Packages.main, {save: true});
    this.npmInstall(Packages.dev, {saveDev: true});
  }
});
