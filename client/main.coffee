'use strict'

require 'bootstrap/less/bootstrap.less'
require 'font-awesome/less/font-awesome.less'
require './stylesheets/app.less'

require './javascripts/app'

div = document.createElement 'div'
div.innerHTML = require './main.jade'
document.body.appendChild div.firstChild
