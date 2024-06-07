import { ApiProperty } from "@nestjs/swagger";

export class SubcategoryPhotoDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}