# Change Log

All notable changes to "Annotator" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2019-04-25
### Fixed
- Fixed the issue that the link text covers the commit tooltip. [#18](https://github.com/ryu1kn/vscode-annotator/issues/18)

## [0.11.1] - 2019-04-25
### Fixed
- Fixed the issue that extension was not working as [`previewHtml`](https://github.com/Microsoft/vscode/issues/62630)
  command had been deprecated and dropped. [#17](https://github.com/ryu1kn/vscode-annotator/issues/17)

## [0.11.0] - 2017-12-17
### Added
- Added a configuration to ignore whitespace when executing `git blame`. [#15](https://github.com/ryu1kn/vscode-annotator/issues/15)

## [0.10.1] - 2016-10-11
### Fixed
- Fixed the problem that annotation tooltip dropped to the left end of the annotation view. [#10](https://github.com/ryu1kn/vscode-annotator/issues/10)

## [0.10.0] - 2016-08-27
### Added
- Allow specifying intermediate colours for the vertical colour bar
- Show the error information of git command if the command provides any

## [0.9.0] - 2016-08-06
### Added
- Made the annotation tooltip text selectable

## [0.8.0] - 2016-08-05
### Changed
- Revised how to set an editor title so that a file name stands out

## [0.7.3] - 2016-08-03
### Fixed
- Fixed the problem that it was not respecting the editor's `git.path` config value

## [0.7.2] - 2016-07-31
### Fixed
- Fixed the problem that trying to see another file diff after opening a file addition diff causes an error
- Fixed the problem that it could not show file list for the initial commit

## [0.7.1] - 2016-07-31
### Fixed
- Fixed a problem that `switchDiffWithinCommit` command was not registered as `activationEvents`

## [0.7.0] - 2016-07-31
### Added
- Added a feature to open a diff of another file changed in the same commit

## [0.6.0] - 2016-07-27
### Added
- Added a feature to show vertical colour bar to indicate the age of each commit

## [0.5.0] - 2016-07-24
### Added
- Added a feature to highlight the annotations with same commit hash on the annotation view

## [0.4.0] - 2016-07-23
### Added
- Let the editor do the syntax highlighting in the diff view

## [0.3.0] - 2016-07-18
### Added
- Added a feature to annotate the contents of the left side of the commit diff

## [0.2.1] - 2016-07-14
### Fixed
- Fixed the problem that code block was not sufficiently escaped

## [0.2.0] - 2016-07-14
### Added
- Added line number in the annotation view

## [0.1.0] - 2016-07-13
### Added
- Added annotation tooltip to display more information about the commit

## [0.0.2] - 2016-07-12
### Fixed
- Fixed the problem that commit author names were not being escaped

## [0.0.1] - 2016-07-11
### Added
- Initial release of Annotator
