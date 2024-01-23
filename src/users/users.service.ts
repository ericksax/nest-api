import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new HttpException('User already exists', 409);
    }

    const newUser = await this.prismaService.user.create({
      data: createUserDto,
    });

    return plainToInstance(ResponseUserDto, newUser);
  }

  findAll() {
    const allUsers = this.prismaService.user.findMany();
    return plainToInstance(ResponseUserDto, allUsers);
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return plainToInstance(ResponseUserDto, user);
  }

  async findByMail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return this.prismaService.user.delete({ where: { id } });
  }
}
