# Annotator

## Features

It displays git blame information of the current file.
By selecting a commit hash of the annotation, the changes made in a particular commit are displayed.

![Annotate and view diff](https://raw.githubusercontent.com/ryu1kn/vscode-annotator/master/images/animations/annotate-code.gif)

## Commands

* `Annotator: Show Git Blame of the Current File`

## Configurations

* `annotator.annotationColumnWidth`: Width of the annotation column
* `annotator.annotationFontColor`: Font color of the annotation text

## Prerequisite

`git` command must be available

## Release Notes

### 0.0.2

* Fixed the problem that commit author names were not being escaped

### 0.0.1

* Initial release of Annotator
