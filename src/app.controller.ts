import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { createOperator, CreateOrgDTO, IcreateOperator, IOrg } from './schema/org.dto';
import { OrgDocument } from './schema/org.schema'

@Controller()
export class AppController {
  logger: Logger;
  constructor(private readonly appService: AppService) {
    this.logger = new Logger()
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('create-org')
  createOrg(@Payload() data: CreateOrgDTO, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    this.appService.createOrg(data)
    channel.ack(originalMsg)
  }

  @EventPattern('update-org')
  updateOrg(@Payload() data, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    this.appService.updateOrg(data)
    channel.ack(originalMsg)
  }

  @EventPattern('upload-image')
  uploadImage(@Payload() data, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    this.appService.uploadImage(data)
    channel.ack(originalMsg)
  }

  @EventPattern('create-operator')
  createOperator(@Payload() data: createOperator, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    const Idata: IcreateOperator = data
    this.appService.createOperator(Idata)
    channel.ack(originalMsg)
  }

  @EventPattern('update-operator')
  updateOperator(@Payload() data: createOperator, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    const Idata: IcreateOperator = data
    this.appService.updateOperatorRole(Idata)
    channel.ack(originalMsg)
  }

  @EventPattern('delete-operator')
  deleteOperator(@Payload() data: { userId: string, orgId: string }, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    this.appService.deleteOperator(data)
    channel.ack(originalMsg)
  }


  @MessagePattern ({ cmd: 'getOrgs' })
  getOrgs(@Ctx() ctx: RmqContext): Promise<OrgDocument[]> {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    channel.ack(originalMsg)
    return this.appService.getOrgs()
  }

  @MessagePattern ({ cmd: 'getOrg' })
  getOrg(@Payload() orgId: string, @Ctx() ctx: RmqContext): Promise<OrgDocument> {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    channel.ack(originalMsg)
    return this.appService.getOrg(orgId)
  }

  @MessagePattern ({ cmd: 'user-orgs' })
  userOrgs(@Payload() author: string, @Ctx() ctx: RmqContext): Promise<OrgDocument[]> {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    channel.ack(originalMsg)
    const orgs = this.appService.userOrgs(author)
    // this.logger.log(orgs)
    return orgs
  }

}
