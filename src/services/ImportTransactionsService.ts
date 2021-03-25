import csv from 'csv-parse';
import fs from 'fs';
import path from 'path';

import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import uploadConfig from '../config/upload';

interface Transactions {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<unknown[]> {
    const transactionsRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    const parser = csv({ delimiter: ', ', from_line: 2, ltrim: true });

    const parserCsv = fs
      .createReadStream(path.join(uploadConfig.directory, filename))
      .pipe(parser);

    const transactions: Transactions[] = [];

    parserCsv.on('data', async row => {
      const obj = {
        title: row[0],
        type: row[1],
        value: row[2],
        category: row[3],
      };

      transactions.push(obj);

      return true;
    });

    await new Promise(resolve => parserCsv.on('end', resolve));

    const promises = transactions.map(
      (item, index) =>
        new Promise(resolve =>
          setTimeout(async () => {
            const findCategory = await categoryRepository.findOne({
              where: { title: item.category },
            });

            let category_id: string | undefined = findCategory?.id;

            if (!findCategory) {
              const newCategory = categoryRepository.create({
                title: item.category,
              });

              await categoryRepository.save(newCategory);

              category_id = newCategory.id;
            }

            const { title, value, type } = item;

            const transaction = transactionsRepository.create({
              title,
              value: Number(value),
              type,
              category_id,
            });

            await transactionsRepository.save(transaction);

            resolve(transaction);
          }, 100 * transactions.length - 100 * index),
        ),
    );

    const result = await Promise.all(promises);

    return result;
  }
}

export default ImportTransactionsService;
