'use strict';

var chalk = require('chalk');
var fs = require('fs');
var libraries = require('../_data/libraries.json');

var repoName = process.argv[2];

if (!isValidRepoName(repoName)) {
    console.error(chalk.red('✘') + ' "%s" is an invalid repo name', repoName);
    process.exit(1);
}

var allRepoNames = libraries
    .filter(function (lib) {
        return (
            typeof lib === 'object'
            && typeof lib.repo === 'string'
        );
    })
    .map(function (lib) {
        return lib.repo.toLowerCase();
    });

if (allRepoNames.indexOf(repoName.toLowerCase()) !== -1) {
    console.error(chalk.red('✘') + ' "%s" has already been added', repoName);
    process.exit(1);
}

libraries.push({
    repo: repoName,
    submittedAt: Date.now()
});

libraries.sort(function (a, b) {
    a = a.repo.toLowerCase();
    b = b.repo.toLowerCase();
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
});

fs.writeFileSync(__dirname + '/../_data/libraries.json', JSON.stringify(libraries, null, '    '));
console.log(chalk.green('✔') + ' "%s" has been added', repoName);
console.log(chalk.green('Done'));

function isValidRepoName (repoName) {
    return /[a-z0-9\-_]\/[a-z0-9\-_]/i.test(repoName);
}
