import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

@ObjectType()
export class Auth {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => User)
  user: User;
}
