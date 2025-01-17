import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "./book.entity";
import { BookRepository } from "./book.repository";
import { CreateBookDto } from "./dto/create-book.dto";
import { AuthorRepository } from "src/author/author.repository";
import { Author } from "src/author/author.entity";
import { ListBookDto } from "./dto/list-book.dto";
import { PageDto } from "src/common/dto/page.dto";
import { PageOptionsDto } from "src/common/dto/page-options.dto";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { Category } from "src/category/category.entity";
import { Repository } from "typeorm";
import { UpdateBookDto } from "./dto/update-book.dto";

@Injectable()
export class BookService {
  private logger = new Logger("Book Service", { timestamp: true });
  constructor(
    @InjectRepository(Book)
    private bookRepository: BookRepository,
    @InjectRepository(Author)
    private authorRepository: AuthorRepository,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async createBook(requestDto: CreateBookDto): Promise<void> {
    const author = await this.findAuthor(requestDto.author_id);
    const category = await this.findCategory(requestDto.category_id);
    const book = this.bookRepository.create({
      title: requestDto.title,
      description: requestDto.description,
      release_date: requestDto.release_date,
      author: author,
      category: category,
    });

    await this.bookRepository.save(book);
  }

  async getBooks(
    search: string,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<ListBookDto>> {
    const resultQuery = await this.bookRepository
      .createQueryBuilder("book")
      .innerJoinAndSelect("book.author", "author")
      .innerJoinAndSelect("book.category", "category")
      .orderBy("book.created_at", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (search) {
      resultQuery.where("title LIKE :search", { search: `%${search}%` });
    }

    try {
      const itemCount = await resultQuery.getCount();
      const { entities } = await resultQuery.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
      const reulstDto = entities.map((v) => {
        const dto = new ListBookDto();
        dto.id = v.secure_id;
        dto.title = v.title;
        dto.description = v.description;
        dto.release_date = v.release_date;
        dto.author_name = v.author.name;
        dto.category = v.category.name;
        return dto;
      });

      return new PageDto(reulstDto, pageMetaDto);
    } catch (error) {
      this.logger.error(
        `getBooks:: Failed to get books, search ${search}, pageOptionsDto ${JSON.stringify(pageOptionsDto)}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async updateBook(id: string, updateDto: UpdateBookDto): Promise<void> {
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
      throw new NotFoundException("Book not found");
    }
  }

  async findBookById(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { secure_id: id },
      relations: { author: true },
    });

    if (!book) {
      throw new NotFoundException("Book not found.");
    }

    return book;
  }

  async findAuthor(authorId: string): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { secure_id: authorId },
    });

    if (!author) {
      throw new NotFoundException("Author not found.");
    }

    return author;
  }

  async findCategory(categoryId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        secureId: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException("Category not found.");
    }

    return category;
  }
}
