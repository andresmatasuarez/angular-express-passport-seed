Seed AngularJS | ExpressJS | PassportJS
=============================

Some features included in this seed:
* `AngularJS` Publicly-accessible web site.
* `AngularJS` Admin dashboard.
* `ExpressJS` API with cookie-based authentication.
* All authentication over `HTTPS`.
* `MongoDB` Persistent user model.
* `CoffeeScript`, `Jade` and `LESS` on client.
* `Bootstrap` base styles.
* `Grunt` task runner
* `Mocha` for server tests.
* `Karma` for client tests.

Some ideas taken from [DaftMonk/generator-angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack)

# Prerequisites
* [MongoDB](http://www.mongodb.org/)
* [NVM](https://github.com/creationix/nvm)

## Pre-installation
1. `cd` into project folder
* `nvm install`
* `sudo npm install -g grunt-cli bower`

## Installation
### Dependencies
* `npm install`
* `bower install`

### SSL certificate for local HTTPS server
1. Create default certificate directory:<br />
  `mkdir server/config/ssl`
> NOTE: If you prefer to store certificate information in a another directory inside project root, don't forget to change config files accordingly.

* Generate key:<br/>
  `openssl genrsa 1024 > server/config/ssl/key.pem`

* Generate certificate:<br/>
  `openssl req -new -key server/config/ssl/key.pem -out csr.pem`

* Sign certificate:<br/>
  `openssl x509 -req -days 365 -in csr.pem -signkey server/config/ssl/key.pem -out server/config/ssl/certificate.crt`

* Remove pem file:<br/>
  `rm csr.pem`

#### Certificate passphrase
If you set a SSL passphrase during certificate generation, please do one of the following:
* If you do not have any local config files:<br />
Create a local config file under `server/config` and add the `ssl.passphrase` entry:<br />
`echo "{\"ssl\": {\"passphrase\": \"%PASSPHRASE%\"}}" >> server/config/local.json`

* If you already had a local config file: <br />
Don't forget to add the `ssl.passphrase` entry with the passphrase you set.

* As an alternative, you can also set the SSL_PASSPHRASE environment variable when running the app:<br />
`SSL_PASSPHRASE=%PASSPHRASE% grunt serve`

## Development
* Consistent coding style is ensured using:
> Don't write a single line of code without any of this tools installed and running inside your editor.
  1. [EditorConfig](http://editorconfig.org/). Supported editors [plugins](http://editorconfig.org/#download)
  2. [JSHint](http://jshint.com/). Supported editors [plugins](http://jshint.com/install/)

* Start web server: `grunt serve`
* Start subscription worker: `node server/bin/worker.js`

## Production environments
* Build project: `grunt build`

# Test
`grunt test:[ server | bo ]`
