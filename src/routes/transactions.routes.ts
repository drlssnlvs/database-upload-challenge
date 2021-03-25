import { Router } from 'express';
import { getCustomRepository, TransactionRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository)

  const { transactions, balance } = await transactionRepository.getBalance()

  return response.json({
    transactions,
    balance
  })
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body

  const createTransactionService = new CreateTransactionService()

  const transaction = await createTransactionService.execute({ title, value, type, category })

  return response.json(transaction)
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deleteTransactionService = new DeleteTransactionService()

  const result = await deleteTransactionService.execute(id)

  return response.json(result)
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
