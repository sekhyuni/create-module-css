# Change Log
All notable changes to the "create-module-css" extension will be documented in this file. Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.5] - 2024-07-16
### Added
- Added a detailed README file explaining the usage, features, installation, and examples of the extension.

## [0.0.4] - 2024-07-16
### Fixed
- Fixed an issue where only the first class name in a nested structure was being created in the index.module.css file. Now all class names are correctly extracted and added to the CSS file, ensuring that elements like title and titleWrapper are both included.
### Changed
- Improved the handling of class name extraction and ordering, ensuring classes are added in the order they appear in the HTML structure and are properly formatted with newlines.

## [0.0.3] - 2024-07-15
### Fixed
- Resolved a bug where the CSS file generation did not correctly handle the first class name in the file.

## [0.0.2] - 2024-07-15
### Added
- Added functionality to automatically insert the import statement if it doesn't already exist.

## [0.0.1] - 2024-07-15
### Added
- Initial release of the "create-module-css" extension. Automatically generates an index.module.css file and adds class definitions based on usage in the JavaScript/TypeScript file.