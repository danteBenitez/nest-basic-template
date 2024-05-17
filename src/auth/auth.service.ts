import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '@/users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';

export interface VerifiedUserPayload {
    access_token: string;
    user: Omit<User, "password">;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(user: SignUpDto): Promise<VerifiedUserPayload> {
        const created = await this.usersService.create({
            ...user,
        });
        const token = this.jwtService.sign({
            sub: created.user_id,
        });

        return {
            access_token: token,
            user: created,
        };
    }

    async signIn(user: SignInDto): Promise<VerifiedUserPayload> {
        const found = await this.usersService.matching(user.name, user.password);

        if (!found) {
            throw new NotFoundException('User not found');
        }

        const token = this.jwtService.sign({
            sub: found.user_id,
        });

        return {
            access_token: token,
            user: found,
        };
    }
}
