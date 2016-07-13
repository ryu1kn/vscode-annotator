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
* `annotator.annotationTooltipWidth`: Width of the annotation tooltip
* `annotator.annotationTooltipBackgroundColor`: Background color of the annotation tooltip

## Prerequisite

`git` command must be available

## Release Notes

### 0.1.0: 13 July 2016

* Added annotation tooltip to display more information about the commit

### 0.0.2: 12 July 2016

* Fixed the problem that commit author names were not being escaped

### 0.0.1: 11 July 2016

* Initial release of Annotator
