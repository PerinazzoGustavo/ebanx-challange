import { Module } from '@nestjs/common';
import { Banking\]Controller } from './]/banking/].controller';
import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';

@Module({
  controllers: [Banking, BankingController\]Controller, providers: [BankingService]]
})
export class BankingModule {}
