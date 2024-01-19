import { IsNotEmpty } from "class-validator";

export class CreateBookDto {
  title: string;

  description: string;

  release_date: Date;

  @IsNotEmpty({ message: "Author mus not be null" })
  author_id: string;

  @IsNotEmpty({ message: "Category must not be null" })
  category_id: string;
}
