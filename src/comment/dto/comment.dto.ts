import { ApiProperty } from "@nestjs/swagger";

export type CommentQueryType = {
    pageIndex: number,
    pageSize: number,
    email: string
}

export class CommentAddDto {
    @ApiProperty({ description: "Gig ID", type: Number })
    gig_id: number;

    @ApiProperty({ description: "Content", type: String })
    content: string;

    @ApiProperty({ description: "Rating", type: Number })
    rating: number;
}

export class CommentUpdateDto {
    @ApiProperty({ description: "Content", type: String })
    content: string;

    @ApiProperty({ description: "Rating", type: Number })
    rating: number;
}

export class CommentUpdateAdminDto {
    @ApiProperty({ description: "Content", type: String })
    content: string;

    @ApiProperty({ description: "Rating", type: Number })
    rating: number;

    @ApiProperty({ description: "Removed", type: Boolean })
    removed: boolean;
}