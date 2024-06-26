import { ApiProperty } from "@nestjs/swagger";

export class AvatarUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}

export class UserAddDto {
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

    @ApiProperty({ description: "Role", type: String })
    role: string;

    @ApiProperty({ description: "Skills", type: [String] })
    skill: string[];

    @ApiProperty({ description: "Cartification", type: [String] })
    certification: string[];
}