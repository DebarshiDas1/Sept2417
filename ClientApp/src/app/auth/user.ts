export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

export interface DecodedJwtPayload {
  name: string;
  email: string;
  // Add other properties as needed
}