import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { LoginResponse, PayloadJwt } from './interfaces/auth.interface';

import { readFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existeUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existeUser) {
      throw new UnprocessableEntityException('El correo ya existe');
    }
    const password = await bcrypt.hashSync(createUserDto.password, 10);

    const createUser = await this.userModel.create({
      ...createUserDto,
      password,
    });
    await createUser.save();
    const { password: _, __v: __, ...newUser } = createUser.toJSON();

    return newUser;
  }

  async register(createUserDto: CreateUserDto): Promise<LoginResponse> {
    const authUser = await this.create(createUserDto);

    const token = await this.generarToken({ id: authUser._id });
    return {
      user: authUser,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).lean();

    if (!user) {
      throw new UnauthorizedException('Credencias no coinciden');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credencias no coinciden!');
    }
    const { password: _, __v: __, ...rest } = user;
    const token = await this.generarToken({ id: user._id });

    return { user: rest, token };
  }

  findAll() {
    return this.userModel.find();
  }

  async findById(id: string) {
    const {
      __v: __,
      password: _,
      ...authUser
    } = await this.userModel.findById(id).lean();

    return authUser;
  }

  async seed() {
    const db = await readFileSync(
      path.resolve(__dirname, '../../src/seeder/db.json'),
      { encoding: 'utf-8' },
    );
    const json = JSON.parse(db);
    await this.userModel.deleteMany({});
    await this.create(json.users[0]);
  }

  async generarToken(payload: PayloadJwt): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
