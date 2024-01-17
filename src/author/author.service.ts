import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { AuthorRepository } from './author.repository';
import { DetailAuthorDto } from './dto/detail-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: AuthorRepository,
  ) {}

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<void> {
    const author = this.authorRepository.create({
      name: createAuthorDto.name,
    });

    await this.authorRepository.save(author);
  }

  async getAuthor(): Promise<DetailAuthorDto[]> {
    const authors = (await this.authorRepository.find()).map((v) => {
      const detailDto = new DetailAuthorDto();
      detailDto.id = v.secure_id;
      detailDto.name = v.name;
      return detailDto;
    });

    return authors;
  }

  async updateAuthor(id: string, updateDto: CreateAuthorDto): Promise<void> {
    const author = await this.findAuthorById(id);
    author.name = updateDto.name;

    this.authorRepository.save(author);
  }

  async findAuthorById(id: string): Promise<Author> {
    const author = this.authorRepository.findOne({
      where: { secure_id: id },
      relations: { book: true },
    });

    if (!author) {
      throw new NotFoundException('Author not found.');
    }

    return author;
  }

  async deleteAuthor(id: string): Promise<void> {
    const author = await this.findAuthorById(id);

    if (author.book.length > 0) {
      throw new InternalServerErrorException('Constraint validation');
    }

    const result = await this.authorRepository.delete({ secure_id: id });

    if (result.affected === 0) {
      throw new NotFoundException('Author not found');
    }
  }
}
