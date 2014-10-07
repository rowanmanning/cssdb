'use strict';

var async = require('async');
var chalk = require('chalk');
var fs = require('fs');
var libraries = require('../_data/libraries.json');
var github = require('octonode');

var githubClient;
if (process.env.CLIENT_ID && process.env.CLIENT_SECRET) {
    githubClient = github.client({
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
    });
} else {
    githubClient = github.client();
}

githubClient.limit(function (err, left, max) {
    console.log(chalk.grey('GitHub API Rate Limit: %d/%d requests remaining'), left, max);
    if (max < 5000) {
        console.error(chalk.red('Authenticate to get a higher rate limit.'));
        console.error(chalk.red('Use CLIENT_ID and CLIENT_SECRET environment variables'));
    }
    if (left === 0) {
        console.error(chalk.red('✘') + ' GitHub API rate limit exceeded');
        return;
    }
    async.each(libraries, updateLibrary, function () {
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
        console.log(chalk.green('Done'));
    });
});

function updateLibrary (lib, done) {
    if (typeof lib !== 'object') {
        console.error(chalk.red('✘') + ' "%s" is not an object', lib);
        return done();
    }
    if (!isValidRepoName(lib.repo)) {
        console.error(chalk.red('✘') + ' "%s" is an invalid repo name', lib.repo);
        lib.isValid = false;
        return done();
    }
    if ((Date.now() - lib.refreshedAt) < 86400000) {
        if (lib.isValid) {
            console.log(chalk.yellow('✔') + ' "%s" was already updated recently', lib.repo);
        } else {
            console.log(chalk.yellow('✘') + ' "%s" was already updated recently', lib.repo);
        }
        return done();
    }
    githubClient.repo(lib.repo).info(function (err, repo) {
        lib.refreshedAt = Date.now();
        if (err) {
            console.error(chalk.red('✘') + ' "%s" could not be loaded from GitHub', lib.repo);
            lib.isValid = false;
            return done();
        }
        lib.isValid = true;
        updateLibraryWithRepoData(lib, repo);
        githubClient.user(repo.owner.login).info(function (err, user) {
            if (err) {
                console.error(chalk.red('✘') + ' The user "%s" could not be loaded from GitHub', repo.owner.login);
                return done();
            }
            updateLibraryWithOwnerData(lib, user);
            calculateLibraryScore(lib);
            console.log(chalk.green('✔') + ' "%s" was updated successfully', lib.repo);
            done();
        });
    });
}

function updateLibraryWithRepoData (lib, repo) {
    lib.name = repo.name;
    lib.repo = repo.full_name;
    lib.description = repo.description;
    lib.repoUrl = repo.html_url;
    lib.homepage = repo.homepage;
    lib.url = lib.homepage || lib.repoUrl;
    lib.createdAt = repo.created_at;
    lib.updatedAt = repo.updated_at;
    lib.pushedAt = repo.pushed_at;
    lib.stars = repo.stargazers_count;
    lib.forks = repo.forks;
    lib.openIssues = repo.open_issues;
    lib.owner = lib.owner || {};
    lib.owner.username = repo.owner.login;
}

function updateLibraryWithOwnerData (lib, owner) {
    lib.owner.name = owner.name;
    lib.owner.avatarUrl = owner.avatar_url;
    lib.owner.gravatarId = owner.gravatar_id;
    lib.owner.homepage = owner.blog;
    lib.owner.githubUrl = owner.html_url;
    lib.owner.url = lib.owner.homepage || lib.owner.githubUrl;
}

function calculateLibraryScore (lib) {
    // TODO work out a nicer scoring mechanism some time

    // Initial counts
    var score = lib.stars;
    score += (lib.forks * 2);

    // Last updated modifiers
    var now = new Date();
    var timeDiff = (Date.now() - (new Date(lib.updatedAt)).getTime()) / 1000;
    var hoursDiff = Math.floor(timeDiff / 3600);
    var timeDeduction = 0;
    if (hoursDiff > 0) {

        // Minus 0.1% per hour inactive
        timeDeduction = ((score / 1000) * hoursDiff);

        // Limit deduction to at most 50% of the original score
        timeDeduction = Math.min(timeDeduction, (score / 2));

        score -= timeDeduction;
    }

    // Add to lib
    lib.score = Math.max(Math.floor(score), 0);
}

function isValidRepoName (repoName) {
    return /[a-z0-9\-_]\/[a-z0-9\-_]/i.test(repoName);
}
