import { User } from './User';
import { Address } from './Address';
import { Entity } from 'typeorm';

describe('User Class', () => {
    it('should create an instance of User', () => {
        const user = new User('John Doe', 'john.doe@example.com', '12345678901', 'password123');
        expect(user).toBeInstanceOf(User);
    });

    it('should set the name, email, cpf, and password properties correctly', () => {
        const user = new User('John Doe', 'john.doe@example.com', '12345678901', 'password123');
        expect(user.name).toBe('John Doe');
        expect(user.email).toBe('john.doe@example.com');
        expect(user.cpf).toBe('12345678901');
        expect(user.password).toBe('password123');
    });

    it('should be able to add addresses to the user', () => {
        const user = new User('John Doe', 'john.doe@example.com', '12345678901', 'password123');
        const address = new Address();
        user.addresses = [address];
        expect(user.addresses.length).toBe(1);
        expect(user.addresses[0]).toBe(address);
    });
});