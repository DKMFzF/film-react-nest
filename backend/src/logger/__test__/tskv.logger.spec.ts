import { TskvLogger } from '../tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  it('should format log message as TSKV', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log('Test message', { user: 'John' });

    const loggedArg = spy.mock.calls[0][0];
    expect(loggedArg).toContain('level=log');
    expect(loggedArg).toContain('message=Test message');
    expect(loggedArg).toContain('param0={"user":"John"}');
    expect(loggedArg).toMatch(/time=\d{4}-\d{2}-\d{2}T/);

    spy.mockRestore();
  });

  it('should format error message correctly', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Something failed');

    const loggedArg = spy.mock.calls[0][0];
    expect(loggedArg).toContain('level=error');
    expect(loggedArg).toContain('message=Something failed');

    spy.mockRestore();
  });
});