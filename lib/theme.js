var api = require('./api');
var deep = require('deep-extend');

exports.patch = function(themeUid, patch, options) {
  api.call('Theme.get',[themeUid, true], options).then(function(theme) {
    console.log('got theme')
    delete theme.uid; //Can't set that.
    delete theme.created;
    delete theme.changed;
    deep(theme, patch);

    return api.call('Theme.set',[themeUid, theme ,true], options).then(function(updated) {
      console.log(JSON.stringify(updated, undefined, 2));
      process.exit();
    });
  }).catch(function(error) {
    console.log('Failed to do request');
    console.log(error);
    process.exit(1);
  });
};
