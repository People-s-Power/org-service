import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateOrgDTO } from './schema/org.dto';
import { Org, OrgDocument } from './schema/org.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Org.name) private readonly orgModel: Model<OrgDocument>
  ) {}


  getHello(): string {
    return 'Hello World!';
  }


  async createOrg(data: ICreateOrgDTO) {
    console.log(data)

    const org = await this.orgModel.create(data)

    console.log(org)

  }
}
