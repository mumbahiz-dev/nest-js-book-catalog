import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcrypt";
import { JwtPayload } from "./jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { Role } from "./role.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async createUser(requestDto: AuthCredentialDto): Promise<void> {
    const existUser = await this.findUser(requestDto.username);

    if (existUser) {
      throw new ConflictException("Username already exists");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(requestDto.password, salt);

    const user = new User();
    user.username = requestDto.username;
    user.password = hashedPassword;

    this.userRepository.save(user);
  }

  async signIn(
    signInDto: AuthCredentialDto
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { username: signInDto.username },
      relations: { roles: true },
    });

    if (user && (await bcrypt.compare(signInDto.password, user.password))) {
      const payload: JwtPayload = {
        username: signInDto.username,
        roles: user.roles.map((role) => role.name),
      };
      const accesToken: string = await this.jwtService.sign(payload);
      return { access_token: accesToken };
    }

    throw new UnauthorizedException("Please check your credentials");
  }

  async findUser(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username: username } });
  }
}
