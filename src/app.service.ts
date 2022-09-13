import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { triggerAsyncId } from 'async_hooks';
import { Model } from 'mongoose';
import { errorMonitor } from 'stream';
import { IcreateOperator, ICreateOrgDTO, IUploadImage, UpdateOrgDTO } from './schema/org.dto';
import { Org, OrgDocument, OrgSchema } from './schema/org.schema';

@Injectable()
export class AppService {
  logger: Logger;
  constructor(
    @InjectModel(Org.name) private readonly orgModel: Model<OrgDocument>
  ) {
    this.logger = new Logger()
  }


  getHello(): string {
    return 'Hello World!';
  }


  async createOrg(data: ICreateOrgDTO) {
    try {
      const org = await this.orgModel.create(data)
      await org.save()
      return org
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

  async createOperator(data: IcreateOperator) {
    const { orgId, userId, role } = data
    const org = await this.orgModel.findById(orgId)
    if(!org) throw new BadRequestException(`Organisation don't exists`)
    const payload = { userId, role }
    org.operators.push(payload)
    await org.save()
    return org
  }

  async updateOperatorRole(data: IcreateOperator) {
    const { userId, orgId, role } = data
    const org = await this.orgModel.findById(orgId)
    if(!org) throw new BadRequestException(`Organisation don't exists`)
    const userIndex = org.operators.findIndex(item => item.userId === userId)
    org.operators[userIndex].role = role
    await org.save()
    return org
  }

  async deleteOperator(data: { userId: string, orgId: string }) {
    const { userId, orgId } = data
    const org = await this.orgModel.findById(orgId)
    if(!org) throw new BadRequestException(`Organisation don't exists`)
    const userIndex = org.operators.findIndex(item => item.userId === userId)
    org.operators.splice(userIndex, 1)
    await org.save()
    return org
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

  async userOrgs(author: string): Promise<OrgDocument[]> {
    try {
      const org = await this.orgModel.find({ author: author })
      console.log(org)
      this.logger.log(org)
      return org
    } catch (error) {
      throw error
    }
  }

  // async addFollowers(id, orgId) {
  //   try {

  //     // Find org
  //     const org = await this.orgModel.findById(orgId)
  //     // Checks if it exists
  //     if(!org) throw new BadRequestException(`Org don't exist`)
      
      
  //     // Check if user is already following
  //     const userIsFollowing =  org.followers.find(item => item === id)
  //     if(userIsFollowing) throw new BadRequestException('User already following')
      
  //     // Add the followed user to the followers following Array
  //     const follower = await this.orgModel.findById(id)
  //     if(!follower) throw new BadRequestException(`User don't exist`)
  //     let { following } = follower
  //     following.push(userId)
  //     follower.followingCount ++

  //     await follower.save()

  //     // Push in new follower
  //     const { followers } = user
  //     const fx = followers
  //     fx.push(id)

  //     // Save new follower
  //     user.followers = fx
  //     user.followersCount ++
  //     const result = await user.save()

  //     const payload = {
  //       userFollowed: {
  //         followers: result.followers,
  //         followersCount: result.followersCount,
  //         following: result.following,
  //         followingCount: result.followingCount
  //       },
  //       userFollowing: {
  //         followers: follower.followers,
  //         followersCount: follower.followersCount,
  //         following: follower.following,
  //         followingCount: follower.followingCount
  //       }
  //     }
  //     return payload
  //   } catch (error) {
  //     throw error
  //   }
  // }


  async unFollow(id, orgId) {
    try {
      
      // Check if Org exists Allways!!!
      const org = await this.orgModel.findById(orgId)
      if(!org) throw new BadRequestException(`User don't exist`)

      // Unfollow the user
      let userIsFollowing =  org.followers.findIndex(item => item === id)
      const { followers } = org
      const fx = followers
      fx.splice(userIsFollowing, 1)

      org.followers = fx
      org.followersCount --
      const result = await org.save()

      // Remove user from following
      const follower = await this.orgModel.findById(id)
      if(!follower) throw new BadRequestException(`User don't exist`)
      let { following } = follower
      const followedUserIndex = following.findIndex(item => item === orgId)
      follower.followingCount --
      follower.following.splice(followedUserIndex, 1)

      await follower.save()

      const payload = {
        userFollowed: {
          followers: org.followers,
          followersCount: org.followersCount,
          following: org.following,
          followingCount: org.followingCount
        },
        userFollowing: {
          followers: follower.followers,
          followersCount: follower.followersCount,
          following: follower.following,
          followingCount: follower.followingCount
        }
      }

      return payload
    } catch (error) {
      throw error
    }

  }

}
