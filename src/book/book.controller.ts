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
import { PageOptionsDto } from "src/common/dto/page-options.dto";
import { PageDto } from "src/common/dto/page.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decorator/roles.decorator";

@Controller("book")
@UseGuards(RolesGuard)
export class BookController {
  private logger = new Logger("TaskController");

  constructor(private bookService: BookService) {}

  @Post()
  createBook(@Body() requestDto: CreateBookDto): Promise<void> {
    return this.bookService.createBook(requestDto);
  }

  @Get()
  @Roles(["Sales", "admin"])
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
    @Body() updateDto: UpdateBookDto
  ): Promise<void> {
    return this.bookService.updateBook(id, updateDto);
  }

  @Delete("/:id")
  deleteBook(@Param("id") id: string): Promise<void> {
    return this.bookService.deleteBook(id);
  }
}
