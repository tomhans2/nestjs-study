import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): any;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before the execution of the handler
    // console.log('Before...', context);
    return next.handle().pipe(
      map((data) => {
        // Run something after the execution of the handler
        // console.log('After...', data);
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
        // return plainToClass(context.getClass(), data);
      }),
    );
  }
}
