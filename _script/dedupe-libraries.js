'use strict';

var chalk = require('chalk');
var fs = require('fs');
var libraries = require('../_data/libraries.json');

var dedupedLibraries = libraries.filter(function (lib, index, libraries) {
    var prev = libraries[index - 1];
    return (!prev || prev.repo !== lib.repo);
});

fs.writeFileSync(__dirname + '/../_data/libraries.json', JSON.stringify(dedupedLibraries, null, '    '));
console.log(chalk.green('✔') + ' %d duplicate libraries have been removed', (libraries.length - dedupedLibraries.length));
console.log(chalk.green('Done'));
