/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import isTokenValid from '../../src/utils/jwt-utils';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode', () => ({ jwtDecode: jest.fn() }));

describe('Validation token', () => {
  beforeEach(() => {
    jwtDecode.mockReturnValue({ exp: 123 });
  });

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

describe('Validation token - jwt-decode v4 named export', () => {
  it('returns false for expired token', () => {
    jwtDecode.mockReturnValue({ exp: 1 });
    expect(isTokenValid('expired.jwt.token')).toBe(false);
  });

  it('returns true for valid non-expired token', () => {
    jwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });
    expect(isTokenValid('valid.jwt.token')).toBe(true);
  });

  it('returns true for token with no exp field', () => {
    jwtDecode.mockReturnValue({});
    expect(isTokenValid('no-exp.jwt.token')).toBe(true);
  });
});
