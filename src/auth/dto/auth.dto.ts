import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({ description: "Email", type: String })
    email: string;

    @ApiProperty({ description: "Password", type: String })
    password: string;
}

export class UserSignUpDto {
    @ApiProperty({ description: "Full Name", type: String })
    full_name: string;

    @ApiProperty({ description: "Email", type: String })
    email: string;

    @ApiProperty({ description: "Password", type: String })
    password: string;

    @ApiProperty({ description: "Phone Number", type: String })
    phone: string;

    @ApiProperty({ description: "Birthday", type: String })
    birthday: string;

    @ApiProperty({ description: "Gender", type: Boolean })
    gender: boolean;
}