import { JsonLogger } from '../json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  it('should log valid JSON string', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log('Hello', { user: 123 });

    const loggedArg = spy.mock.calls[0][0];
    const parsed = JSON.parse(loggedArg);

    expect(parsed).toHaveProperty('message', 'Hello');
    expect(parsed).toHaveProperty('level', 'log');
    expect(parsed).toHaveProperty('context');
    expect(parsed.context[0]).toEqual({ user: 123 });

    spy.mockRestore();
  });

  it('should log error as JSON', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Something went wrong');

    const loggedArg = spy.mock.calls[0][0];
    const parsed = JSON.parse(loggedArg);

    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('Something went wrong');

    spy.mockRestore();
  });
});