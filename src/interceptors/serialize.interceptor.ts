//proces przeksztalcania obiektow
import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {}; //this is class Definition
}

//custom decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

//Implements - create new class that satisfied all requirements of interface or abstract class (in out example NestInterceptors have to be satisfied)
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // Run something before request is handled

    return handler.handle().pipe(
      map((data: any) => {
        //Run something before response is send out
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, //remove values which are not excluded in UserDto
        });
      })
    );
  }
}
