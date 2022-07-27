import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { triggerAsyncId } from 'async_hooks';
import { Model } from 'mongoose';
import { errorMonitor } from 'stream';
import { ICreateOrgDTO, IUploadImage, UpdateOrgDTO } from './schema/org.dto';
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
    try {
      const org = await this.orgModel.create(data)
      return 'success'
    } catch (error) {
      throw error
    }
  }

  async getOrgs(): Promise<OrgDocument[]> {
    try {
      const orgs = await this.orgModel.find()
      return orgs
    } catch (error) {
      throw error
    }
  }

  async getOrg(orgId: string): Promise<OrgDocument> {
    try {
      const org = await this.orgModel.findById(orgId)
      return org
    } catch (error) {
      throw error
    }
  }

  async uploadImage(data: IUploadImage) {
    try {
      const image = data.img
      const org = await this.orgModel.findByIdAndUpdate(
        data.orgId,
        {
          $set: { image },
        },
        { new: true },
      );
      return data;
    } catch (error) {
      throw error;
    }
  }


  async updateOrg(data: UpdateOrgDTO) {
    try {
      const org = await this.orgModel.findByIdAndUpdate(
        data.orgId,
        { ...data },
        {
          new: true,
        },
      );
      return org;
    } catch (error) {
      throw error;
    }
  }

}
