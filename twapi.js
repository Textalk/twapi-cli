#!/usr/bin/env node
var argv = require('yargs').argv;
var api = require('./lib/api');
var theme = require('./lib/theme');
var fs = require('fs');

if (argv._.length < 1) {
  console.log('Usage: twapi-cli -w <webshop> [-a <auth>] [-l <lang>] [-u <api-url>] <method> [<param1> <param2> ...]');
  console.log('       twapi-cli -w <webshop> [-a <auth>] [-l <lang>] [-u <api-url>] theme-update <theme-id> <patch>');
  console.log('       twapi-cli -w <webshop> [-a <auth>] [-l <lang>] [-u <api-url>] theme-set-js <theme-id> <file>');
  process.exit();
}


var options = {
  apiUrl:  argv.u || process.env.TWAPI_URL || 'http://shop.textalk.se/backend/jsonrpc/v1',
  webshop: argv.w || process.env.TWAPI_WEBSHOP || 22222
};
if (argv.l) { options.language = argv.l; }
if (argv.a) { options.auth = argv.a; }


if (argv._[0] === 'theme-update') {
  // Special case. Theme blobb updating
  var patch;
  try {
    patch = JSON.parse(argv._[2]);
  } catch (e) {
    console.log('Could not parse patch');
    process.exit(1);
  }

  theme.patch(argv._[1], patch, options);

} else if (argv._[0] === 'theme-set-js') {
  var file = fs.readFileSync(argv._[2]);

  theme.patch(argv._[1], {
    params: {
      settings: {
        custom_javascript: {
          script: file.toString()
        }
      }
    }
  }, options);
} else {
  var method = argv._[0];
  // Ordinary request
  var params = argv._.slice(1).map(function(arg) {
    try {
      return JSON.parse(arg);
    } catch (e) {
      console.log('Failed to parse argument ' + arg);
      process.exit(1);
    }
  });
  api.call(argv._[0], params, options).then(function(result) {
    console.log(JSON.stringify(result, undefined, 2));
    process.exit();
  }, function(error) {
    console.log('Failed to do request');
    console.log(error);
    process.exit(1);
  });
}
