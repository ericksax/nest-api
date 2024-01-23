import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByMail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid password or email');
    }

    const userMatch = compare(password, user.password);
    if (!userMatch) {
      throw new UnauthorizedException('Invalid password or email');
    }

    return {
      token: this.jwtService.sign({ email }, { subject: user.id }),
    };
  }
}
