import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const dbConfig = {
      autoLoadEntities: true,
    };

    switch (process.env.NODE_ENV) {
      case 'development':
        Object.assign(dbConfig, {
          type: this.configService.get<string>('DB_TYPE'),
          synchronize: JSON.parse(this.configService.get<string>('SYNCHRONIZE')),
          database: this.configService.get<string>('DB_NAME'),
        });
        break;
      case 'test':
        Object.assign(dbConfig, {
          type: this.configService.get<string>('DB_TYPE'),
          synchronize: JSON.parse(this.configService.get<string>('SYNCHRONIZE')),
          database: this.configService.get<string>('DB_NAME'),
          migrationsRun: JSON.parse(this.configService.get<string>('MIGRATIONS_RUN')),
        });
        break;
      case 'production':
        Object.assign(dbConfig, {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          synchronize: false,
          migrationsRun: true,
          ssl: {
            rejectUnauthorized: false,
          },
        });
        // Object.assign(dbConfig, {
        //   type: this.configService.get<string>('DB_TYPE'),
        //   //synchronize: have to be false ?
        //   synchronize: JSON.parse(this.configService.get<string>('SYNCHRONIZE')),
        //   url: process.env.DATABASE_URL,
        //   database: this.configService.get<string>('DB_NAME'),
        //   migrationsRun: JSON.parse(this.configService.get<string>('MIGRATIONS_RUN')),
        //   ssl: {
        //     rejectUnauthorized: JSON.parse(this.configService.get<string>('SSL')),
        //   },
        // });
        break;

      default:
        throw new Error('unknown environment');
    }

    return dbConfig;

    // return {
    //   type: 'sqlite',
    //   synchronize: process.env.NODE_ENV === 'test' ? true : false,
    //   database: this.configService.get<string>('DB_NAME'),
    //   autoLoadEntities: true,
    //   migrationsRun: process.env.NODE_ENV === 'test' ? true : false,
    //   keepConnectionAlive: process.env.NODE_ENV === 'test' ? true : false,
    // };
  }
}
