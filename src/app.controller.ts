import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateOrgDTO, IOrg } from './schema/org.dto';
import { OrgDocument } from './schema/org.schema'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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

  @EventPattern('upload-image')
  uploadImage(@Payload() data, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    this.appService.uploadImage(data)
    channel.ack(originalMsg)
  }



  @MessagePattern ({ cmd: 'getOrgs' })
  getOrgs(@Ctx() ctx: RmqContext): Promise<OrgDocument[]> {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    return this.appService.getOrgs()
    channel.ack(originalMsg)
  }

  @MessagePattern ({ cmd: 'getOrg' })
  getOrg(@Payload() orgId: string, @Ctx() ctx: RmqContext): Promise<OrgDocument> {
    const channel = ctx.getChannelRef()
    const originalMsg = ctx.getMessage()
    return this.appService.getOrg(orgId)
    channel.ack(originalMsg)
  }
}
