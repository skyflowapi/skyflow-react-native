# Changelog

All notable changes to this project will be documented in this file.

## [1.6.1] - 2024-01-25
### Fixed
- Fixed multiple column names error with unique column values in `get` interface.

## [1.6.0] - 2023-12-14
### Added
- `get` method support

## [1.5.0] - 2023-10-10
### Added
- reveal support for signed data tokens.
- `valueType` in reveal response.
### Fixed
- removed trimming of spaces in event listeners state value.
## [1.4.0] - 2023-06-30
### Added
- Composable elements support.
## [1.3.0] - 2023-06-07
### Added
-   `redaction` prop in reveal element component.
## [1.2.2] - 2023-03-20
### Fixed
-   Removed grace period logic for bearer token generation.
## [1.2.1] - 2023-03-02
### Fixed
- fix grace period logic of cached bearer token.
## [1.2.0] - 2022-11-15
### Added
-   `upsert` support while collecting data through skyflow elements.
## [1.1.0] - 2022-11-09
### Added
- Added Asterisk symbol for label of required collect element. 
- `requiredAsterisk` custom styles to collect element labelStyles.
### Changed
- OnFoucs of invalid collect element, removed errorText. 
## [1.0.1] - 2022-11-01

### Changed

- Changed `InputField` element to `InputFieldElement`. 
- Changed `CardHolderElement` element to `CardHolderNameElement` 


## [1.0.0] - 2022-10-11

- Inital Skyflow React Native SDK release