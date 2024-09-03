import validator from 'validator';
import { UserDto } from '../dto/UserDto';

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  export function validateCPF(cpf: string): boolean {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    return cpfRegex.test(cpf);
  }
  
  export function validateUser(user: UserDto) {
    const errors = [];
    if (!validator.isEmail(user.email)) {
        errors.push('Invalid email format');
    }

    if (!validator.isLength(user.password, { min: 6 })) {
        errors.push('Password must be at least 6 characters long');
    }
    if (!user.name || user.name.trim().length === 0) {
      errors.push("Name is required.");
    }
  
  
    if (!user.cpf || !validateCPF(user.cpf)) {
      errors.push("Invalid CPF.");
    }
  
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  
  export function validateAddress(address: any) {
    const errors = [];
  
    if (!address.street || address.street.trim().length === 0) {
      errors.push("Street is required.");
    }
  
    if (!address.city || address.city.trim().length === 0) {
      errors.push("City is required.");
    }
  
    if (!address.state || address.state.trim().length === 0) {
      errors.push("State is required.");
    }
  
    if (!address.zipcode || address.zipcode.trim().length === 0) {
      errors.push("Zipcode is required.");
    }
  
    if (!address.userId) {
      errors.push("User ID is required.");
    }
  
    return {
      valid: errors.length === 0,
      errors,
    };
  }