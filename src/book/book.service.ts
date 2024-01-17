import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { AuthorRepository } from 'src/author/author.repository';
import { Author } from 'src/author/author.entity';
import { ListBookDto } from './dto/list-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: BookRepository,
    @InjectRepository(Author)
    private authorRepository: AuthorRepository,
  ) {}

  async createBook(requestDto: CreateBookDto): Promise<void> {
    const author = await this.findAuthor(requestDto.author_id);
    const book = this.bookRepository.create({
      title: requestDto.title,
      description: requestDto.description,
      release_date: requestDto.release_date,
      author: author,
    });

    await this.bookRepository.save(book);
  }

  async getBooks(): Promise<ListBookDto[]> {
    return (
      await this.bookRepository.find({ relations: { author: true } })
    ).map((v) => {
      const dto = new ListBookDto();
      dto.id = v.secure_id;
      dto.title = v.title;
      dto.description = v.description;
      dto.release_date = v.release_date;
      dto.author_name = v.author.name;

      return dto;
    });
  }

  async updateBook(id: string, updateDto: CreateBookDto): Promise<void> {
    const book = await this.findBookById(id);
    const author = await this.findAuthor(updateDto.author_id);

    book.title = updateDto.title;
    book.description = updateDto.description;
    book.release_date = updateDto.release_date;
    book.author = author;

    this.bookRepository.save(book);
  }

  async deleteBook(id: string): Promise<void> {
    const result = this.bookRepository.delete({ secure_id: id });

    if ((await result).affected === 0) {
      throw new NotFoundException('Book not found');
    }
  }

  async findBookById(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { secure_id: id },
      relations: { author: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }
  async findAuthor(authorId: string): Promise<Author> {
    const author = this.authorRepository.findOne({
      where: { secure_id: authorId },
    });

    if (!author) {
      throw new NotFoundException('Author not found.');
    }

    return author;
  }
}
