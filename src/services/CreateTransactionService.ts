import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category'

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('type is invalid');
    }

    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category)

    const findCategory = await categoryRepository.findOne({ where: { title: category }})

    let category_id: string | undefined = findCategory?.id

    if(!findCategory) {
      const newCategory = categoryRepository.create({ title: category })

      await categoryRepository.save(newCategory)

      category_id = newCategory.id
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id
    });

    await transactionRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
