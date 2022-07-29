import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices'
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const rmqUrl = process.env.RMQ_URL
  const queue = process.env.RMQ_QUEUE
  const logger = new Logger('MAIN');

  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: rmqUrl,
  //     queue: 'mail_queue',
  //     noAck: false,
  //     queueOptions: {
  //       durable: false
  //     }
  //   } 
  // });

  const PORT = process.env.PORT

  const app = await NestFactory.create(AppModule)
  app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: rmqUrl,
        queue: queue,
        noAck: false,
        queueOptions: {
          durable: false
        }
      }
    })

    await app.startAllMicroservices()
    // app.useGlobalPipes(new ValidationPipe())
  
  logger.log('microservices is listening')
  await app.listen(PORT, () => {
    Logger.log(`server started on port ${PORT}`);
  });
}
bootstrap();
