import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger();
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `[${method}] ${originalUrl} : ${statusCode} - ${responseTime}`,
      );
    });

    next();
  }
}

// 요청과 응답에 대한 로깅 : [HTTP 메서드] URL : 상태 코드 - 응답 시간
// API호출을 마쳤을 때, API가 얼마나 시간이 소요됐는지 출력
