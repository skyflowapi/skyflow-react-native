/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import isTokenValid from '../../src/utils/jwt-utils';
jest.mock('jwt-decode', () => () => ({ exp: 123 }));

describe('Validation token', () => {
  it('empty token', () => {
    const res = isTokenValid('');
    expect(res).toBe(false);
  });

  it('invalid token type', () => {
    const res = isTokenValid({});
    expect(res).toBe(false);
  });

  it('invalid token', () => {
    const res = isTokenValid('token');
    expect(res).toBe(false);
  });
});
