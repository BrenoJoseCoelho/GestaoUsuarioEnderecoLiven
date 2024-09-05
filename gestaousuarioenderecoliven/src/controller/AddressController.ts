import { Repository, ILike } from "typeorm";
import { Address } from "../entity/Address";
import { AppDataSource } from "../data-source";
import { validateAddress } from "../utils/validators";
import { AddressDto } from "../dto/AddressDto";

class ValidationError extends Error {}
class NotFoundError extends Error {}

export class AddressController {
  private _repo: Repository<Address>;

  constructor() {
    this._repo = AppDataSource.getRepository(Address);
  }

  async salvar(addressDTO: AddressDto): Promise<Address> {
    try {
      const { valid, errors } = validateAddress(addressDTO);
      if (!valid) {
        throw new ValidationError(errors.join(", "));
      }

      const address = this._repo.create(addressDTO);
      return await this._repo.save(address);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error; 
      }
      throw new Error("Internal Server Error");
    }
  }

  async recuperarPorUsuario(userId: number): Promise<Address[]> {
    try {
      return await this._repo.find({
        where: { user: { id: userId } },
      });
    } catch {
      throw new Error("Internal Server Error");
    }
  }

  async recuperarPorId(id: number): Promise<Address> {
    try {
      const address = await this._repo.findOneBy({ id });
      if (!address) {
        throw new NotFoundError(`Address with ID ${id} not found.`);
      }
      return address;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error; 
      }
      throw new Error("Internal Server Error");
    }
  }

  async atualizar(id: number, dadosAtualizados: Partial<AddressDto>): Promise<Address> {
    try {
      const existingAddress = await this.recuperarPorId(id);

      const { valid, errors } = validateAddress({ ...existingAddress, ...dadosAtualizados });
      if (!valid) {
        throw new ValidationError(errors.join(", "));
      }

      await this._repo.update(id, dadosAtualizados);
      return this.recuperarPorId(id);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error; 
      }
      throw new Error("Internal Server Error");
    }
  }

  async remover(id: number): Promise<boolean> {
    try {
      const address = await this.recuperarPorId(id);
      if (address) {
        await this._repo.remove(address);
        return true;
      }
      return false;
    } catch {
      throw new Error("Internal Server Error");
    }
  }

  async recuperarEnderecosPorPais(country: string): Promise<Address[]> {
    try {
      if (typeof country !== 'string' || !country.trim()) {
        throw new ValidationError('Country must be a non-empty string');
      }

      return await this._repo.find({
        where: {
          country: ILike(`%${country}%`)
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error; 
      }
      throw new Error("Internal Server Error");
    }
  }
}
