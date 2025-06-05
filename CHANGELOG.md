# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-03-20

### Added
- Initial implementation of storage system with browser and Figma plugin support
- GitHub repository integration for file listing
- Account settings page with GitHub and Airtable configuration
- Themes page for viewing configurations and repository files

### Fixed
- Storage system message passing in Figma plugin environment
- Configuration loading and saving in both browser and plugin contexts
- Race conditions in config loading and saving operations
- Added proper error handling and timeout management

### Changed
- Improved development mode logging for better debugging
- Enhanced error messages and user feedback
- Sequential config loading to prevent message handling issues 