import { Repository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from 'bcryptjs';
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
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await this._repo.findOne({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });

    res.json({ token });
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

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(userDTO.password, 10);

        // Criação do usuário
        const user = this._repo.create({
            ...userDTO,
            password: hashedPassword, // Salva a senha criptografada
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