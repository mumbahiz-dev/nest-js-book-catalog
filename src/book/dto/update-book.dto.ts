import { PartialType } from "@nestjs/swagger";
import { CreateBookDto } from "./create-book.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateBookDto extends PartialType(CreateBookDto) {}
