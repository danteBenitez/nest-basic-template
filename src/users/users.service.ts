import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
  ) { }

  get saltRounds(): number {
    const saltRounds = this.configService.get<ENVIRONMENT['SALT_ROUNDS']>('SALT_ROUNDS');
    if (!saltRounds) {
      return 10;
    }
    return parseInt(saltRounds);
  }

  get defaultRole(): Role {
    return this.roleRepository.create({ name: ROLES.USER });
  }

  async create(user: CreateUserDto) {
    const found = await this.usersRepository.findOne({
      where: [{ name: user.name }, { email: user.email }],
    });

    if (found) {
      throw new ConflictException("User or email already exists");
    }

    const userInstance = this.usersRepository.create({
      ...user,
      roles: [this.defaultRole],
    });
    userInstance.password = await bcrypt.hash(user.password, this.saltRounds);
    await this.usersRepository.save(userInstance);
    return userInstance;
  }

  async update(user_id: string, user: Partial<User>) {
    const found = await this.usersRepository.findOne({ where: { user_id } });
    if (!found) {
      throw new NotFoundException("User not found");
    }

    let password = user.password;
    if (password) {
      password = await bcrypt.hash(password, this.saltRounds);
    }

    const userInstance = this.usersRepository.merge(found, user);
    userInstance.password = password as string;
    await this.usersRepository.save(userInstance);

    return userInstance;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email }, relations: ['roles'] });
  }

  async findOneByName(name: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { name }, relations: ['roles'] });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { user_id: id },
      relations: ['roles'],
    });
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Returns a user matching the given username and password if found. 
   * Otherwise, returns null.
   * 
   * @param user 
   * @param username 
   * @param password 
   */
  async matching(username: string, password: string): Promise<User | null> {
    const found = await this.findOneByName(username);
    if (!found) {
      return null;
    }
    const matches = await this.comparePassword(password, found.password);

    if (!matches) {
      return null;
    }
    return found;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles']
    });
  }
}
