import { DevLogger } from '../dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;

  beforeEach(() => {
    logger = new DevLogger();
  });

  it('should add [DEV] prefix to message', () => {
    const spy = jest.spyOn(logger as any, 'printMessages').mockImplementation(() => {});

    logger.log('Hello world');

    expect(spy).toHaveBeenCalledWith(
      ["[DEV] Hello world"],
      undefined,
      "log"
    );

    spy.mockRestore();
  });
});
