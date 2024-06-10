import { ApiProperty } from "@nestjs/swagger";

export class OrderAddDto {
    @ApiProperty({ description: "Gig ID", type: Number })
    gig_id: number;
}

export class OrderUpdateDto {
    @ApiProperty({ description: "Status", type: Boolean })
    status: boolean;

    @ApiProperty({ description: "Removed", type: Boolean })
    removed: boolean;
}