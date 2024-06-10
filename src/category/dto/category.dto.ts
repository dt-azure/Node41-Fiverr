import { ApiProperty } from "@nestjs/swagger";

export class CategoryAddDto {
    @ApiProperty({ description: "Category", type: String })
    category_name: string;
}