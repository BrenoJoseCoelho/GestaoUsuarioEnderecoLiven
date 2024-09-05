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

  async register(userDTO: UserDto): Promise<User> {
    try {
      const { valid, errors } = validateUser(userDTO);
      if (!valid) {
        throw new ValidationError(errors.join(", "));
      }

      const existingUser = await this._repo.findOneBy({ email: userDTO.email });
      if (existingUser) {
        throw new ConflictError('Email already in use');
      }

      const existingCpf = await this._repo.findOneBy({ cpf: userDTO.cpf });
      if (existingCpf) {
        throw new ConflictError('CPF already in use');
      }

      const hashedPassword = await bcrypt.hash(userDTO.password, 10);
      userDTO.password = hashedPassword;

      const user = this._repo.create(userDTO);
      return await this._repo.save(user);
    } catch (error) {
      throw error; 
    }
  }

  async recuperarTodos(): Promise<User[]> {
    try {
      return await this._repo.find();
    } catch (error) {
      throw new Error('Error retrieving users');
    }
  }

  async recuperarPorId(id: number): Promise<User> {
    try {
      const user = await this._repo.findOne({
        where: { id },
        relations: ["addresses"],
      });
      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found.`);
      }
      return user;
    } catch (error) {
      throw error; 
    }
  }

  async atualizar(id: number, dadosAtualizados: Partial<UserDto>): Promise<User> {
    try {
      await this.recuperarPorId(id);

      const userDtoToValidate: UserDto = {
        ...await this.recuperarPorId(id), 
        ...dadosAtualizados, 
      } as UserDto; 

      const { valid, errors } = validateUser(userDtoToValidate);
      if (!valid) {
        throw new ValidationError(errors.join(", "));
      }

      await this._repo.update(id, dadosAtualizados);
      return await this.recuperarPorId(id);
    } catch (error) {
      throw error; 
    }
  }

  async remover(id: number): Promise<boolean> {
    try {
      const user = await this.recuperarPorId(id);
      if (user) {
        await this._repo.remove(user);
        return true;
      }
      return false;
    } catch (error) {
      throw error; 
    }
  }
}

class ValidationError extends Error {}
class ConflictError extends Error {}
class NotFoundError extends Error {}
