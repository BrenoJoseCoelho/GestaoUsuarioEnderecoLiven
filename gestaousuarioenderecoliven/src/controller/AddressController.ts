import { Repository, ILike } from "typeorm";
import { Address } from "../entity/Address";
import { AppDataSource } from "../data-source";
import { validateAddress } from "../utils/validators";
import { AddressDto } from "../dto/AddressDto";

export class AddressController {
  private _repo: Repository<Address>;

  constructor() {
    this._repo = AppDataSource.getRepository(Address);
  }

  async salvar(addressDTO: AddressDto) {
    const { valid, errors } = validateAddress(addressDTO);
    if (!valid) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    const address = this._repo.create(addressDTO);
    const addressSalvo = await this._repo.save(address);
    return addressSalvo;
  }

  async recuperarPorUsuario(userId: number) {
    const addresses = await this._repo.find({
      where: { user: { id: userId } },
    });
    return addresses;
  }

  async recuperarPorId(id: number) {
    const address = await this._repo.findOne({
      where: { id },
    });
    if (!address) {
      throw new Error(`Address with ID ${id} not found.`);
    }
    return address;
  }

  async atualizar(id: number, dadosAtualizados: Partial<Address>) {
    const address = await this.recuperarPorId(id);

    const { valid, errors } = validateAddress({ ...address, ...dadosAtualizados });
    if (!valid) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    await this._repo.update(id, dadosAtualizados);
    const addressAtualizado = await this.recuperarPorId(id);
    return addressAtualizado;
  }

  async remover(id: number) {
    const address = await this.recuperarPorId(id);
    if (address) {
      await this._repo.remove(address);
      return true;
    }
    return false;
  }

  async recuperarEnderecosPorPais(country: string) {
    if (typeof country !== 'string') {
      throw new Error('Country must be a string');
    }

    const addresses = await this._repo.find({
      where: {
        country: ILike(`%${country}%`)
    }
    });

    return addresses;
  }
}