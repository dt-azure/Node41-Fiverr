import { ApiProperty } from "@nestjs/swagger";

export class GigAddDto {
    @ApiProperty({ description: "Gig Name", type: String })
    gig_name: string;

    @ApiProperty({ description: "Reviews", type: Number })
    reviews: number;

    @ApiProperty({ description: "Price", type: Number })
    price: string;

    @ApiProperty({ description: "Description", type: String })
    gig_desc: string;

    @ApiProperty({ description: "Short Description", type: String })
    short_gig_desc: string;

    @ApiProperty({ description: "Subcategory", type: Number })
    subcategory: number;
}


export class GigUpdateDto {
    @ApiProperty({ description: "Gig Name", type: String })
    gig_name: string;

    @ApiProperty({ description: "Price", type: Number })
    price: string;

    @ApiProperty({ description: "Description", type: String })
    gig_desc: string;

    @ApiProperty({ description: "Short Description", type: String })
    short_gig_desc: string;

    @ApiProperty({ description: "Subcategory", type: Number })
    subcategory: number;
}

export class GigUpdateAdminDto {
    @ApiProperty({ description: "Gig Name", type: String })
    gig_name: string;

    @ApiProperty({ description: "Reviews", type: Number })
    reviews: number;

    @ApiProperty({ description: "Price", type: Number })
    price: string;

    @ApiProperty({ description: "Description", type: String })
    gig_desc: string;

    @ApiProperty({ description: "Short Description", type: String })
    short_gig_desc: string;

    @ApiProperty({ description: "Subcategory", type: Number })
    subcategory: number;

    @ApiProperty({ description: "Rating", type: Number })
    rating: number;

    @ApiProperty({ description: "Removed", type: Boolean })
    removed: boolean;
}