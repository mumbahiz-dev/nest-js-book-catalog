import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { ListBookDto } from "./dto/list-book.dto";
import { JwtGuard } from "src/auth/jwt.guard";
import { PageDto } from "./dto/page.dto";
import { PageOptionsDto } from "./dto/page-options.dto";

@Controller("book")
@UseGuards(JwtGuard)
export class BookController {
  private logger = new Logger("TaskController");

  constructor(private bookService: BookService) {}

  @Post()
  createBook(@Body() requestDto: CreateBookDto): Promise<void> {
    return this.bookService.createBook(requestDto);
  }

  @Get()
  getBooks(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query("search", new DefaultValuePipe("")) search: string
  ): Promise<PageDto<ListBookDto>> {
    this.logger.verbose(`Page Options Dto ${JSON.stringify(pageOptionsDto)}`);
    return this.bookService.getBooks(search, pageOptionsDto);
  }

  @Put("/:bookId")
  updateBook(
    @Param("bookId") id: string,
    @Body() updateDto: CreateBookDto
  ): Promise<void> {
    return this.bookService.updateBook(id, updateDto);
  }

  @Delete("/:id")
  deleteBook(@Param("id") id: string): Promise<void> {
    return this.bookService.deleteBook(id);
  }
}
