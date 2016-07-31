# Annotator

## Features

* Display the annotation view (git blame) of the current file.
* Display the diff of a particular commit by selecting a commit hash on the annotation view.
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
* `annotator.annotationCommitColorRange`: Range of colors to be used for coloring each commit
* `annotator.annotationCommitColorBarWidth`: Width of the commit color bar
* `annotator.annotationFontColor`: Font color of the annotation text
* `annotator.annotationHighlightColor`: Highlight color when hovering over the annotation text
* `annotator.annotationTooltipWidth`: Width of the annotation tooltip
* `annotator.annotationTooltipBackgroundColor`: Background color of the annotation tooltip

## Prerequisite

`git` command must be available

## Repository

* https://github.com/ryu1kn/vscode-annotator

## Release Notes

### 0.7.0: 31 July 2016

* Added a feature to open a diff of another file changed in the same commit

### 0.6.0: 27 July 2016

* Added a feature to show vertical colour bar to indicate the age of each commit

### 0.5.0: 24 July 2016

* Added a feature to highlight the annotations with same commit hash on the annotation view

### 0.4.0: 23 July 2016

* Let the editor do the syntax highlighting in the diff view

### 0.3.0: 18 July 2016

* Added a feature to annotate the contents of the left side of the commit diff

### 0.2.1: 14 July 2016

* Fixed the problem that code block was not sufficiently escaped

### 0.2.0: 14 July 2016

* Added line number in the annotation view

### 0.1.0: 13 July 2016

* Added annotation tooltip to display more information about the commit

### 0.0.2: 12 July 2016

* Fixed the problem that commit author names were not being escaped

### 0.0.1: 11 July 2016

* Initial release of Annotator
