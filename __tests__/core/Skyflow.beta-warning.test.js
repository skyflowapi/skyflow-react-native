/*
    Copyright (c) 2026 Skyflow, Inc.
*/
// SK-2963: beta-build-in-prod warning.
//
// Mocking src/sdkDetails (rather than only unit-testing isNonGaVersion/isNonProdVaultUrl
// in isolation, as helper.test.js does) lets us exercise the real end-to-end wiring in the
// Skyflow constructor against a fake non-GA version. src/sdkDetails.ts is generated at
// build time (scripts/generateSdkDetails.js) - the copy checked into the repo is an empty
// placeholder, so this is also the only way to exercise the "warns" path at all here.
jest.mock('../../src/sdkDetails', () => ({
  sdkDetails: {
    name: 'skyflow-react-native',
    version: '99.0.0-beta.1',
    reactNativeVersion: '0.70.0',
  },
}));

import Skyflow from '../../src/core/Skyflow';
import { LogLevel } from '../../src/utils/constants';

describe('Skyflow beta-build-in-prod warning (SK-2963)', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('warns when a non-GA build looks like it is pointed at a Production vault', () => {
    new Skyflow({
      vaultID: 'vault_id',
      vaultURL: 'https://abc123.vault.skyflowapis.com',
      getBearerToken: jest.fn(),
      options: { logLevel: LogLevel.WARN },
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('beta/pre-release build')
    );
  });

  it('does not warn when the vaultURL carries a non-prod (sandbox) marker', () => {
    new Skyflow({
      vaultID: 'vault_id',
      vaultURL: 'https://abc123.vault.skyflowapis-preview.com',
      getBearerToken: jest.fn(),
      options: { logLevel: LogLevel.WARN },
    });

    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('beta/pre-release build')
    );
  });

  it('does not warn when the log level suppresses WARN', () => {
    new Skyflow({
      vaultID: 'vault_id',
      vaultURL: 'https://abc123.vault.skyflowapis.com',
      getBearerToken: jest.fn(),
      options: { logLevel: LogLevel.ERROR },
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
