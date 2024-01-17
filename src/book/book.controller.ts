import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ListBookDto } from './dto/list-book.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Post()
  createBook(@Body() requestDto: CreateBookDto): Promise<void> {
    return this.bookService.createBook(requestDto);
  }

  @Get()
  getBooks(): Promise<ListBookDto[]> {
    return this.bookService.getBooks();
  }

  @Put('/:bookId')
  updateBook(
    @Param('id') id: string,
    @Body() updateDto: CreateBookDto,
  ): Promise<void> {
    return this.bookService.updateBook(id, updateDto);
  }

  @Delete('/:id')
  deleteBook(@Param('id') id: string): Promise<void> {
    return this.bookService.deleteBook(id);
  }
}
