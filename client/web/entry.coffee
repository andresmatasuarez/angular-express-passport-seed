'use strict'

require './stylesheets/app.less'

require './javascripts/app'

div = document.createElement 'div'
div.innerHTML = require './main.jade'
document.body.appendChild div.firstChild
