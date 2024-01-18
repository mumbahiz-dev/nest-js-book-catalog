import { Author } from "src/author/author.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated("uuid")
  @Column()
  secure_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: "timestamp" })
  release_date: Date;

  @ManyToOne(() => Author, (author) => author.book, { eager: true })
  @JoinColumn({ name: "author_id" })
  author: Author;
}
