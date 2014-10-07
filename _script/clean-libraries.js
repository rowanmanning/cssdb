'use strict';

var chalk = require('chalk');
var fs = require('fs');
var libraries = require('../_data/libraries.json');

var validLibraries = libraries
    .filter(function (lib) {
        return (
            typeof lib === 'object'
            && typeof lib.repo === 'string'
            && isValidRepoName(lib.repo)
        );
    });

fs.writeFileSync(__dirname + '/../_data/libraries.json', JSON.stringify(validLibraries, null, '    '));
console.log(chalk.green('✔') + ' %d invalid libraries have been removed', (libraries.length - validLibraries.length));
console.log(chalk.green('Done'));

function isValidRepoName (repoName) {
    return /[a-z0-9\-_]\/[a-z0-9\-_]/i.test(repoName);
}
