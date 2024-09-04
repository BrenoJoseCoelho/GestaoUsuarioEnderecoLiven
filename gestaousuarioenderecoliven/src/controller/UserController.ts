import { Repository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt';
import { AppDataSource } from "../data-source";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validateEmail, validateCPF, validateUser } from "../utils/validators";
import { UserDto } from "../dto/UserDto";

export class UserController {
  private _repo: Repository<User>;

  constructor() {
    this._repo = AppDataSource.getRepository(User);
  }
 async register(userDTO: UserDto) {
        // Validação dos dados de entrada
        const { valid, errors } = validateUser(userDTO);
        if (!valid) {
            throw new Error(`Validation failed: ${errors.join(", ")}`);
        }

        // Verifica se o email já está em uso
        const existingUser = await this._repo.findOneBy({ email: userDTO.email });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        // Verifica se o CPF já está em uso
        const existingCpf = await this._repo.findOneBy({ cpf: userDTO.cpf });
        if (existingCpf) {
            throw new Error('CPF already in use');
        }
console.log(userDTO.password);
        // Criptografar a senha
        const hashedPassword = await bcrypt.hashSync(userDTO.password, 10);
        console.log(userDTO.password);
        userDTO.password =hashedPassword;

        // Criação do usuário
        const user = this._repo.create({
            ...userDTO,
        });

        // Salva o usuário no banco
        const userSalvo = await this._repo.save(user);

        return userSalvo;
    }

  async recuperarTodos() {
    const users = await this._repo.find();
    return users;
  }

  async recuperarPorId(id: number) {
    const user = await this._repo.findOne({
      where: { id },
      relations: ["addresses"],
    });
    if (!user) {
      throw new Error(`User with ID ${id} not found.`);
    }
    return user;
  }

  async atualizar(id: number, dadosAtualizados: Partial<User>) {
    const user = await this.recuperarPorId(id);

    // Validação do usuário
    const { valid, errors } = validateUser({ ...user, ...dadosAtualizados });
    if (!valid) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    await this._repo.update(id, dadosAtualizados);
    const userAtualizado = await this.recuperarPorId(id);
    return userAtualizado;
  }

  async remover(id: number) {
    const user = await this.recuperarPorId(id);
    if (user) {
      await this._repo.remove(user);
      return true;
    }
    return false;
  }
}