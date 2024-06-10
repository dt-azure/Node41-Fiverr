import { ApiProperty } from "@nestjs/swagger";

export class SubcategoryPhotoDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}

export class SubcategoryAddDto {
    @ApiProperty({ description: "Subcategory", type: String })
    subcategory_name: string;

    @ApiProperty({ description: "Category ID", type: String })
    category_id: string;
}

export class SubcategoryAddWithItemsDto {
    @ApiProperty({ description: "Subcategory", type: String })
    subcategory_name: string;

    @ApiProperty({ description: "Category ID", type: String })
    category_id: string;

    @ApiProperty({ description: "Subcategory Items", type: [String] })
    subcategory_items: string[];
}

export class SubcategoryListAddDto {
    @ApiProperty({ description: "Subcategory Items", type: [String] })
    subcategory_items: string[];
}