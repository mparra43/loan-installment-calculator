import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PostgresTypeOrmConfigService } from './database/services/postgres-type-orm-config.service';
import { LoanCalculationEntity } from './database/entities/loan-calculation.typeorm.entity';
import { TypeOrmLoanCalculationRepository } from './database/repositories/loan-calculation.typeorm.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: PostgresTypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([LoanCalculationEntity]),
  ],
  providers: [TypeOrmLoanCalculationRepository],
  exports: [TypeOrmLoanCalculationRepository],
})
export class InfrastructureModule {}