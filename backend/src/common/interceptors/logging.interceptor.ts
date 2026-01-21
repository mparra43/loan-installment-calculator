import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    
    // Solo logueamos si no es una función anónima o interna irrelevante
    if (className && handlerName) {
        this.logger.log(`Starting ${className}.${handlerName}...`);
    }

    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() => {
             if (className && handlerName) {
                this.logger.log(`Finished ${className}.${handlerName} - ${Date.now() - now}ms`);
             }
        }),
      );
  }
}
