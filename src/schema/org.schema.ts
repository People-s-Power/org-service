import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StaffRoleEnum } from './org.dto';
import { Document, Types } from 'mongoose';

export type OrgDocument = Org &
  Document & {
    _id: any;
    _doc: any;
  };

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      doc.id = doc._id;
      delete ret._id;
      delete doc._id;
      ret.name = ret.firstName + ' ' + ret.lastName;
      doc.name = doc.firstName + ' ' + doc.lastName;

      return ret;
    },
  },
})

@Schema({
  timestamps: true
})
export class Org {
  @Prop()
  author: string;
  @Prop({ require: true, unique: true })
  orgName: string;
  @Prop({ require: true, unique: true })
  email: string;
  @Prop({ require: true })
  description: string;
  @Prop({ require: true, unique: true })
  phone: string;
  @Prop()
  followers: string[];
  @Prop()
  following: string[];
  @Prop({ default: 0 })
  followersCount: number;
  @Prop({ default: 0 })
  followingCount: number;
  @Prop()
  operators: [];
  @Prop({ default: 'Facebook link' })
  facebook: string;
  @Prop({ default: 'linkedIn link' })
  linkedIn: string;
  @Prop({ default: 'Instagram link' })
  instagram: string;
  @Prop({ default: 'twitter link' })
  twitter: string;
  @Prop()
  country: string;
  @Prop()
  city: string;
}

export const OrgSchema = SchemaFactory.createForClass(Org);
