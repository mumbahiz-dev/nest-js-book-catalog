import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { AuthorModule } from './author/author.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    BookModule,
    AuthorModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '34.101.82.152',
      port: 3306,
      username: 'developer',
      password: 'welcome1',
      database: 'db_mumbahiz_book_catalog',
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
