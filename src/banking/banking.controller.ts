import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query, Res,
} from '@nestjs/common';
import { EventRequest } from './banking.dtos';
import { BankingService } from './banking.service';
import { Response } from 'express';

@Controller()
export class BankingController {
  constructor(private readonly bankingService: BankingService) {
  }
  @Post('reset')
  @HttpCode(200)
  public async resetBankingData() {
    return this.bankingService.reset();
  }

  /* Teve que ser usado Res por conta dos filtros nativos do NestJs*/
  @Get('balance')
  public async getAccountBalance(
    @Query('account_id') accountId: string,
    @Res() res: Response
  ) {
    try {
      const balance = this.bankingService.findAccountBalanceById(accountId);
      return res.status(200).json(balance);
    } catch (error) {
      return res.status(404).send('0');
    }
  }

  /* Teve que ser usado Res por conta dos filtros nativos do NestJs*/
  @Post('event')
  public async bankingEvent(
    @Body() event: EventRequest,
    @Res() res: Response
  ) {
    try {
      return res.status(201).json(this.bankingService.manageEvent(event));

    } catch (error) {
      return res.status(404).send('0');
    }
  }
}
