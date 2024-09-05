// __tests__/Address.test.ts
import { Address } from './Address';
import { User } from './User';

describe('Address Class', () => {
    it('should create an instance of Address', () => {
        const address = new Address();
        expect(address).toBeInstanceOf(Address);
    });

    it('should set the street, city, state, and zipcode properties correctly', () => {
        const address = new Address();
        address.street = '123 Main St';
        address.city = 'New York';
        address.state = 'NY';
        address.zipcode = '10001';

        expect(address.street).toBe('123 Main St');
        expect(address.city).toBe('New York');
        expect(address.state).toBe('NY');
        expect(address.zipcode).toBe('10001');
    });

    it('should set the country property correctly when provided', () => {
        const address = new Address();
        address.country = 'USA';

        expect(address.country).toBe('USA');
    });

    it('should associate an address with a user', () => {
        const user = new User('John Doe', 'john.doe@example.com', '12345678901', 'password123');
        const address = new Address();
        address.user = user;

        expect(address.user).toBe(user);
    });

    it('should handle addresses without a country', () => {
        const address = new Address();
        address.street = '456 Elm St';
        address.city = 'Los Angeles';
        address.state = 'CA';
        address.zipcode = '90001';

        expect(address.country).toBeUndefined();
        expect(address.street).toBe('456 Elm St');
        expect(address.city).toBe('Los Angeles');
        expect(address.state).toBe('CA');
        expect(address.zipcode).toBe('90001');
    });
});
