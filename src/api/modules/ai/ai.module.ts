import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeepseekService } from './deepseek.service';
import { AiProvider, Secret } from '@buildingai/db/entities';

@Module({
  imports: [TypeOrmModule.forFeature([AiProvider, Secret], 'default')],
  providers: [DeepseekService],
  exports: [DeepseekService],
})
export class AiModule {}
