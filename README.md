[![Build Status](https://travis-ci.org/ryu1kn/vscode-annotator.svg?branch=master)](https://travis-ci.org/ryu1kn/vscode-annotator) [![Code Climate](https://codeclimate.com/github/ryu1kn/vscode-annotator/badges/gpa.svg)](https://codeclimate.com/github/ryu1kn/vscode-annotator)

# Annotator

## Features

* Display the annotation view (git blame) of the current file.
* Display the diff of a particular commit by selecting the annotation of a line.
* From the commit diff view, you can:
  * Open the annotation view of the file just before the commit, and trace back the history.
  * Open the diff of another file in the same commit.
* The vertical colour bar is coloured darker for older commits and lighter for more recent commits (or the other way around, depending on the colours you specified).
* Highlight the annotations with same commit hash when hovering over them.

Blame the current file and open the diff of a particular commit

![Annotate and view diff](https://raw.githubusercontent.com/ryu1kn/vscode-annotator/master/images/animations/annotate-code.gif)

From the commit diff, annotate the contents of the left side of the diff view

![Annotate the file contents before the commit](https://raw.githubusercontent.com/ryu1kn/vscode-annotator/master/images/animations/annotate-contents-of-before-selected-commit.gif)

From the commit diff, open the diff of another file in the same commit

![Open the diff of another file in the same commit](https://raw.githubusercontent.com/ryu1kn/vscode-annotator/master/images/animations/open-diff-of-another-file.gif)

Annotation with different colour settings, etc.

![Annotation with different colour settings](https://raw.githubusercontent.com/ryu1kn/vscode-annotator/master/images/screencaptures/light-theme.png)

## Commands

* `Annotator: Annotate the Current File or the File Before the Commit (if on Commit Diff)`
    * *Command ID:* `annotator.annotate`
* `Annotator: Show Diff of Another File Changed in the Same Commit`
    * *Command ID:* `annotator.switchDiffWithinCommit`

## Configurations

* `annotator.annotationColumnWidth`: Width of the annotation column
* `annotator.annotationCommitColorRange`: Range of colours to be used for colouring each commit. Specify intermediate colours by giving more than 2 colours
* `annotator.annotationCommitColorBarWidth`: Width of the commit colour bar
* `annotator.annotationFontColor`: Font colour of the annotation text
* `annotator.annotationHighlightColor`: Highlight colour when hovering over the annotation text
* `annotator.annotationTooltipWidth`: Width of the annotation tooltip
* `annotator.annotationTooltipBackgroundColor`: Background colour of the annotation tooltip
* `annotator.git.ignoreWhitespaceOnBlame`: Ignore whitespace when `git blame` by specifying [`-w` option](https://www.git-scm.com/docs/git-blame#git-blame--w).

## Prerequisite

`git` command must be available. You need to either make `git` available in your `PATH` or set `git.path` in your settings.

## Request Features or Report Bugs

* https://github.com/ryu1kn/vscode-annotator/issues

## Changelog

* https://github.com/ryu1kn/vscode-annotator/blob/master/CHANGELOG.md
