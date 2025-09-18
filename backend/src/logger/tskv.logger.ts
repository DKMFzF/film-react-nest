import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private format(level: string, message: any, ...optionalParams: any[]): string {
    const parts = [
      `time=${new Date().toISOString()}`,
      `level=${level}`,
      `message=${String(message)}`,
    ];

    if (optionalParams.length) {
      optionalParams.forEach((p, idx) => {
        parts.push(`param${idx}=${JSON.stringify(p)}`);
      });
    }

    return parts.join('\t');
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.format('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.format('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.format('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.format('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.debug(this.format('verbose', message, ...optionalParams));
  }
}
