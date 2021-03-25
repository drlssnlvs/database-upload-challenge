import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<{ ok: boolean }> {
    const transactionRepository = getRepository(Transaction);

    await transactionRepository.delete(id)

    return { ok: true}
  }
}

export default DeleteTransactionService;
