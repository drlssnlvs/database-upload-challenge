import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<{transactions: Transaction[], balance: Balance}> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator, current) => {
        switch (current.type) {
          case 'income':
            accumulator.income += current.value;
            break;
          case 'outcome':
            accumulator.outcome += current.value;
            break;
          default:
            break;
        }

        return accumulator
      },
      {
        income: 0,
        outcome: 0,
      },
    );

    return {
      transactions,
      balance: {
        income,
        outcome,
        total: income - outcome
      }
    }
  }
}

export default TransactionsRepository;
