import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Org, OrgSchema } from './schema/org.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.mongoDB_URI),
    MongooseModule.forFeature([{ name: Org.name, schema: OrgSchema }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
