import { Module } from "@nestjs/common";
import { BookModule } from "./book/book.module";
import { AuthorModule } from "./author/author.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configValidtionSchema } from "./config.schema";
import { CommonModule } from './common/common.module';
import { CategoryModule } from './category/category.module';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidtionSchema,
    }),
    BookModule,
    AuthorModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: "mysql",
          synchronize: true,
          autoLoadEntities: true,
          logging: true,
          host: configService.get("DB_HOST"),
          port: configService.get("DB_PORT"),
          username: configService.get("DB_USERNAME"),
          password: configService.get("DB_PASSWORD"),
          database: configService.get("DB_DATABASE"),
        };
      },
    }),
    AuthModule,
    CommonModule,
    CategoryModule,
    PublisherModule,
  ],
})
export class AppModule {}
