import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { PostgresTypeOrmConfigService } from './database/services/postgres-type-orm-config.service';
import { LoanCalculationEntity } from './database/entities/loan-calculation.typeorm.entity';
import { TypeOrmLoanCalculationRepository } from './database/repositories/loan-calculation.typeorm.repository';
import { CacheService } from './cache/service/cache.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: PostgresTypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([LoanCalculationEntity]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: (configService.get<number>('CACHE_TTL') || 3600) * 1000,
        max: configService.get<number>('CACHE_MAX_ITEMS') || 100,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    TypeOrmLoanCalculationRepository,
    {
      provide: 'LoanCalculationRepository',
      useClass: TypeOrmLoanCalculationRepository,
    },
    CacheService,
  ],
  exports: [TypeOrmLoanCalculationRepository, 'LoanCalculationRepository', CacheService],
})
export class InfrastructureModule {}