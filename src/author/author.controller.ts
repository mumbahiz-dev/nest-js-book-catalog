import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorService } from './author.service';
import { DetailAuthorDto } from './dto/detail-author.dto';

@Controller('author')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Post()
  createAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<void> {
    return this.authorService.createAuthor(createAuthorDto);
  }

  @Get()
  getAuthor(): Promise<DetailAuthorDto[]> {
    return this.authorService.getAuthor();
  }

  @Patch('/:id')
  updateAuthor(
    @Body() updateDto: CreateAuthorDto,
    @Param('id') id: string,
  ): Promise<void> {
    return this.authorService.updateAuthor(id, updateDto);
  }

  @Delete('/:id')
  deleteAuthor(@Param('id') id: string): Promise<void> {
    return this.authorService.deleteAuthor(id);
  }
}
