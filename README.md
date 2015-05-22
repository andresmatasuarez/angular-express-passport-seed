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

# Pre-installation
1. `cd` into project folder
* `nvm install`
* `sudo npm install -g grunt-cli bower`

# Installation
## Dependencies
* `npm install`
* `bower install`

## SSL certificate for local HTTPS server
1. Create default certificate directory (skip if directory already created):<br />
  `mkdir server/config/ssl`
> NOTE: If you prefer to store certificate information in a another directory inside project root, don't forget to change config files accordingly.

* Generate key:<br/>
  `openssl genrsa 1024 > server/config/ssl/key.pem`

* Generate certificate:<br/>
  `openssl req -new -key server/config/ssl/key.pem -out csr.pem`

* Sign certificate:<br/>
  `openssl x509 -req -days 365 -in csr.pem -signkey server/config/ssl/key.pem -out server/config/ssl/certificate.crt`

* Passphrase (only if passphrase was not left blank when creating certificate):<br/>
  `echo CHALLENGE_PASSWORD >> server/config/ssl/passphrase`
> NOTE: If passphrase is not set, don't forget to remove ssl.passphrase entry from config files (config/default.js and any corresponding environment)

* Remove certificate file (optional):<br/>
  `rm csr.pem`

# Development
`grunt serve`

# Build
`grunt build`

# Test
`grunt test:[ server | bo ]`
