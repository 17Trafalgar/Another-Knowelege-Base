import { UserEntity } from 'src/models/user/user.entity';
import { EGender } from 'src/utils/enum';

export class UserResponseSchema {
  id: number;
  firstName: string;
  lastName: string;
  gender: EGender;
  birthday?: Date | null;
  phone: string;
  email: string;
}

export function transformToUserSchema(user: UserEntity): UserResponseSchema {
  const { id, firstName, lastName, gender, birthday, phone, email } = user;

  const schema: UserResponseSchema = {
    id,
    firstName,
    lastName,
    gender,
    birthday,
    phone,
    email,
  };

  return schema;
}
