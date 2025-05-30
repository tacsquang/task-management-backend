import { User } from "../entities/user.entity";

export class UserDto {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  avatar: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.is_active = user.is_active;
    this.avatar = user.avatar ?? "";
  }
}