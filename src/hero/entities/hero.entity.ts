import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'heroes' })
export class Hero extends Document {
  @Prop({ required: true, index: true, minlength: 3, type: String })
  superhero: string;

  @Prop({ required: true, index: true, minlength: 3, type: String })
  publisher: string;

  @Prop({ required: true, type: String })
  alter_ego: string;

  @Prop({ required: true, type: String })
  first_appearance: string;

  @Prop({ required: true, type: String })
  characters: string;

  @Prop({ type: String, required: false })
  alt_img?: string;

  @Prop({ type: String, required: false })
  slug?: string;
}

export const HeroSchema = SchemaFactory.createForClass(Hero);
