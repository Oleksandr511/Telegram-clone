import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Chat {
  @Field(() => String)
  name: string;
  @Field(() => String)
  type: string;
  @Field(() => String)
  description: string;
}
