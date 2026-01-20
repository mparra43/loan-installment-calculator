import { Module } from '@nestjs/common';
// Modules
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configs
import appConfig from './config/app.config';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { LoanCalculatorModule } from '@modules/loan-calculator/loan-calculator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
      InfrastructureModule,
      LoanCalculatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
