import { Module } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { AuthorController } from "./author.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Author } from "./author.entity";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  providers: [AuthorService],
  controllers: [AuthorController],
})
export class AuthorModule {}
