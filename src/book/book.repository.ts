import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookRepository extends Repository<Book> {}
