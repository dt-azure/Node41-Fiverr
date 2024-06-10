import { ApiProperty } from "@nestjs/swagger";

export class ApiQueryDto {
    @ApiProperty({ description: "Page Index", type: Int32Array })
    pageIndex: number;

    @ApiProperty({ description: "Page Size", type: Int32Array })
    pageSize: string;

    @ApiProperty({ description: "Keyword", type: String, required: false })
    keyword: string;

}