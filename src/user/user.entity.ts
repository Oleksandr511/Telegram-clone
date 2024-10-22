import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  userId: string;
  @Field(() => String)
  name: string;
  @Field(() => String)
  phoneNumber: string;
}
