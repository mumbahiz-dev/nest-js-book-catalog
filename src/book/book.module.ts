import { Module } from "@nestjs/common";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./book.entity";
import { Author } from "src/author/author.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { Category } from "src/category/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author, Category]), ConfigModule],
  controllers: [BookController],
  providers: [BookService, JwtService],
})
export class BookModule {}
