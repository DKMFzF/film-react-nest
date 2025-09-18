import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class DevLogger extends ConsoleLogger {
  log(message: string, ...optionalParams: any[]) {
    super.log(`[DEV] ${message}`, ...optionalParams);
  }
}
