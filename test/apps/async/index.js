'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var path = require('path');
var url = require('url');

var pages = [
  {
    id: 1,
    title: 'Title 1'
  },
  {
    id: 2,
    title: 'Title 2'
  },
  {
    id: 3,
    title: 'Title 3'
  }
]

var comments = [
  {
    id: 1,
    page: 1,
    subject: 'Title 1 Comment 1',
    auther: 'JT'
  },
  {
    id: 2,
    page: 1,
    subject: 'Title 1 Comment 2',
    auther: 'Anna'
  },
  {
    id: 2,
    page: 1,
    subject: 'Title 1 Comment 3',
    auther: 'Jane'
  },
  {
    id: 2,
    page: 1,
    subject: 'Title 1 Comment 4',
    auther: 'Bob'
  },
  {
    id: 2,
    page: 4,
    subject: 'Title 4 Comment 1',
    auther: 'Jill'
  }
]

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function create(hbs, env) {
  if (env) process.env.NODE_ENV = env;
  var app = express();
  var viewsDir = path.join(__dirname, 'views');

  // Hook in express-hbs and tell it where known directories reside
  app.engine('hbs', hbs.express4({
    defaultLayout: path.join(viewsDir, "layout.hbs")
  }));
  app.set('view engine', 'hbs');
  app.set('views', viewsDir);

  app.use(cookieParser());

  app.get('/', function (req, res) {
    res.render('index', {
      message: 'Hello,',
      username: req.cookies.user
    });
  });

  hbs.registerAsyncHelper('user', function(username, resultcb) {
    setTimeout(function() {
      resultcb(username);
    }, getRandomNumber(100, 900))
  });

  hbs.registerAsyncHelper('pages', function(options, resultcb) {
    console.log(`pages options: ${JSON.stringify(options, null, 2)}`);
    var self = this;
    console.log(`pages self: ${JSON.stringify(self, null, 2)}`);
    console.log(`options keys: ${JSON.stringify(Object.keys(options), null, 2)}`);
    setTimeout(function() {
      const result = [];
      for(var i = 0; i < pages.length; i++) {
        result.push(options.fn(pages[i]));
      }
      resultcb(result.join(''));
    }, getRandomNumber(100, 900))
  });

  hbs.registerAsyncHelper('comments', function(options, resultcb) {
    console.log(`comments options: ${JSON.stringify(options, null, 2)}`);
    var self = this;
    console.log(`comments self: ${JSON.stringify(self, null, 2)}`);
    setTimeout(function() {
      const result = [];
      for(var i = 0; i < comments.length; i++) {
        result.push(options.fn(comments[i]));
      }
      resultcb(result.join(''));
    }, getRandomNumber(100, 900))
  });

  return app;
}

exports.create = create;
