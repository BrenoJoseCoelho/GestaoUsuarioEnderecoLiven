import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Address } from './Address';

@Entity()
export class User {
    constructor(name: string, email: string, cpf: string, password: string) {
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
    }
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    cpf: string

    @Column()
    password: string
    
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

}
