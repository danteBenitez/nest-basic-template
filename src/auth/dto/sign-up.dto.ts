import { IsString, IsStrongPassword } from "class-validator";

export class SignUpDto {
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsString({ message: 'Email must be a string' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
    })
    password: string;
}