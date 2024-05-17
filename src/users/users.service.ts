import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from '@/config/env';
import { Role } from '@/auth/entities/role.entity';
import { ROLES } from '@/auth/consts';


/**
 * Service responsible for handling user-related operations.
 * 
 * @internal
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private configService: ConfigService
  ) {}

  get saltRounds(): number {
    return parseInt(this.configService.get<ENVIRONMENT['SALT_ROUNDS']>('SALT_ROUNDS'));
  }

  get defaultRole(): Role {
    return this.roleRepository.create({ name: ROLES.USER });
  }

  async create(user: CreateUserDto): Promise<User> {
    const userInstance = this.usersRepository.create({ 
        ...user,
        roles: [this.defaultRole],
    });
    userInstance.password = await bcrypt.hash(user.password, this.saltRounds);
    return this.usersRepository.save(user);
  }

  async update(user_id: string, user: Partial<User>) {
    const found = await this.usersRepository.findOne({ where: { user_id } });
    let password = user.password;
    if (password) {
      password = await bcrypt.hash(password, this.saltRounds); 
    }

    const userInstance = this.usersRepository.merge(found, user);
    userInstance.password = password;

    await this.usersRepository.save(userInstance);

    const { password: _, ...result } = userInstance;

    return result;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { user_id: id },
    });
  }
  
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Returns true if the given user's name and password match the given username and password.
   * 
   * @param user 
   * @param username 
   * @param password 
   */
  async matches(user: User, username: string, password: string): Promise<boolean> {
    return user.name == username && (await this.comparePassword(password, user.password));
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
