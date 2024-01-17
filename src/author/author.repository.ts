import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorRepository extends Repository<Author> {}
