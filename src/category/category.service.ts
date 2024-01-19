import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";
import { PageDto } from "src/common/dto/page.dto";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { PageOptionsDto } from "src/common/dto/page-options.dto";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { CategoryRequestDto } from "./dto/category-request.dt";

@Injectable()
export class CategoryService {
  private logger = new Logger("CategoryService", { timestamp: true });
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async getCategories(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<CategoryResponseDto>> {
    const categoreis = this.categoryRepository
      .createQueryBuilder("category")
      .orderBy("created_at", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    try {
      const itemCount = await categoreis.getCount();
      const { entities } = await categoreis.getRawAndEntities();

      const responseDto = (await entities).map((category) => {
        const dto = new CategoryResponseDto();
        dto.id = category.secureId;
        dto.createdAt = category.createdAt;
        dto.name = category.name;
        return dto;
      });

      const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

      return new PageDto(responseDto, pageMetaDto);
    } catch (error) {
      this.logger.error(
        `getCategories:: Failed get categories with parameter ${JSON.stringify(pageOptionsDto)}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async createCategory(categoryRequestDto: CategoryRequestDto): Promise<void> {
    const category = new Category();
    category.name = categoryRequestDto.name;

    this.categoryRepository.save(category);
  }
}
