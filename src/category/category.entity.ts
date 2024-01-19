import { Book } from "src/book/book.entity";
import { BaseEntity } from "src/common/abstrat-base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: "category" })
export class Category extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
