
CSSDB
=====

This is the source code for http://cssdb.co/ – a curated collection of great CSS, Sass, LESS and Stylus libraries.


Submitting
----------

To submit a library to CSSDB, you'll need Git and Node.js installed on your machine.

1. Fork this repository
2. Clone your fork locally
3. Install dependencies by running `make deps`
4. Run `make add-lib repo=foo/bar` where `foo/bar` is the GitHub repo you wish to add
5. Commit the change that is made to `_data/libraries.json` and open a pull request


Running Locally
---------------

To run the CSSDB site locally, install [Jekyll][jekyll] and run with `make serve`.


Bugs/Features/Questions
-----------------------

Use the project [issue tracker][issues] to track bugs, request/discuss features, and ask questions.


License
-------

![CC BY-NC 3.0](http://i.creativecommons.org/l/by-nc/3.0/88x31.png)  
This source code (and design) is licensed under the [Creative Commons Attribution-NonCommercial 3.0 Unported][cc-by-nc] license.



[cc-by-nc]: http://creativecommons.org/licenses/by-nc/3.0/
[issues]: https://github.com/rowanmanning/cssdb/issues
[jekyll]: http://jekyllrb.com/
