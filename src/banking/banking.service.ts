import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Account, EventRequest } from './banking.dtos';

@Injectable()
export class BankingService {
  private accounts: Map<string, { id: string; balance: number }> = new Map();

  reset(): string {
    this.accounts.clear();
    return "OK";
  }

  findAccountBalanceById(accountId: string): number {
    const account = this.findAccountById(accountId);
    if (typeof account === 'undefined') {
      throw new HttpException('0.0', HttpStatus.NOT_FOUND);
    }
    return account.balance;
  }

  manageEvent(event: EventRequest) {
    switch (event.type) {
      case 'deposit': {
        if (
          typeof event.destination === 'undefined' ||
          typeof event.amount === 'undefined'
        ) {
          throw new BadRequestException();
        }
        return this.deposit({
          destination: event.destination,
          amount: event.amount,
        });
      }
      case 'withdraw': {
        if (
          typeof event.origin === 'undefined' ||
          typeof event.amount === 'undefined'
        ) {
          throw new BadRequestException();
        }
        return this.withdraw({ origin: event.origin, amount: event.amount });
      }
      case 'transfer': {
        if (
          typeof event.origin === 'undefined' ||
          typeof event.destination === 'undefined' ||
          typeof event.amount === 'undefined'
        ) {
          throw new BadRequestException();
        }
        return this.transfer({
          origin: event.origin,
          destination: event.destination,
          amount: event.amount,
        });
      }
    }
  }

  findAccountById(accountId: string) {
    const account = this.accounts.get(accountId);

    if (typeof account === 'undefined') {
      return undefined;
    }
    return account;
  }

  deposit(event: { destination: string; amount: number }): {
    destination: Account;
  } {
    const account = this.findAccountById(event.destination);
    if (account === undefined) {
      const accountId = event.destination;
      return {
        destination: this.accounts
          .set(accountId, { id: accountId, balance: event.amount })
          .get(accountId)!!,
      };
    }

    const currentBalance = account.balance;
    const newBalance = currentBalance + event.amount;

    return {
      destination: this.accounts
        .set(account.id, { id: account.id, balance: newBalance })
        .get(account.id)!!,
    };
  }

  withdraw(event: { origin: string; amount: number }): { origin: Account } {
    const account = this.findAccountById(event.origin);
    if (account === undefined) {
      throw new HttpException('0.0', HttpStatus.NOT_FOUND);
    }

    const currentBalance = account.balance - event.amount;
    this.accounts.set(account.id, { id: account.id, balance: currentBalance });

    return {
      origin: {
        id: account.id,
        balance: currentBalance,
      },
    };
  }

  transfer(event: { origin: string; destination: string; amount: number }) {
    const originResult = this.withdraw({ origin: event.origin, amount: event.amount });
    const destResult = this.deposit({ destination: event.destination, amount: event.amount });

    return {
      origin: originResult.origin,
      destination: destResult.destination
    };
  }}
