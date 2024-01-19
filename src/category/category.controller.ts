import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { PageOptionsDto } from "src/common/dto/page-options.dto";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { PageDto } from "src/common/dto/page.dto";
import { CategoryRequestDto } from "./dto/category-request.dt";

@Controller("category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategories(
    @Query() pageOpstionDto: PageOptionsDto
  ): Promise<PageDto<CategoryResponseDto>> {
    return this.categoryService.getCategories(pageOpstionDto);
  }

  @Post()
  createCategory(
    @Body() categoryRequestDto: CategoryRequestDto
  ): Promise<void> {
    return this.categoryService.createCategory(categoryRequestDto);
  }
}
