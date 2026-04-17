import { isValidNextUrl } from 'infra/page-guard';

describe('isValidNextUrl', () => {
  it('deve aceitar caminhos internos válidos', () => {
    expect(isValidNextUrl('/dates')).toBe(true);
    expect(isValidNextUrl('/join-group?code=abc123')).toBe(true);
    expect(isValidNextUrl('/groups')).toBe(true);
  });

  it('deve rejeitar URLs que não começam com /', () => {
    expect(isValidNextUrl('https://evil.com')).toBe(false);
    expect(isValidNextUrl('http://evil.com')).toBe(false);
    expect(isValidNextUrl('evil.com/path')).toBe(false);
    expect(isValidNextUrl('')).toBe(false);
  });

  it('deve rejeitar URLs que começam com // (protocol-relative)', () => {
    expect(isValidNextUrl('//evil.com')).toBe(false);
    expect(isValidNextUrl('//evil.com/path')).toBe(false);
  });

  it('deve rejeitar caminhos para /api/', () => {
    expect(isValidNextUrl('/api/v1/users')).toBe(false);
    expect(isValidNextUrl('/api/v1/sessions')).toBe(false);
  });

  it('deve rejeitar URLs com mais de 500 caracteres', () => {
    const longPath = '/' + 'a'.repeat(500);
    expect(isValidNextUrl(longPath)).toBe(false);
  });

  it('deve rejeitar valores não-string', () => {
    expect(isValidNextUrl(null as unknown as string)).toBe(false);
    expect(isValidNextUrl(undefined as unknown as string)).toBe(false);
    expect(isValidNextUrl(123 as unknown as string)).toBe(false);
  });
});
