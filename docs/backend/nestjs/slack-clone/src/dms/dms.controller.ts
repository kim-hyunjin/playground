import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { DmsService } from './dms.service';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('DMS')
@Controller('api/workspaces')
export class DmsController {
  constructor(private readonly dmsService: DmsService) {}

  @ApiOperation({ summary: '워크스페이스 DM 모두 가져오기' })
  @Get(':url/dms')
  async getWorkspaceChannels(@Param('url') url, @User() user) {
    return this.dmsService.getWorkspaceDMs(url, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 특정 DM 채팅 모두 가져오기' })
  @Get(':url/dms/:id/chats')
  async getWorkspaceDMChats(
    @Param('url') url,
    @Param('id', ParseIntPipe) id: number,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
    @User() user,
  ) {
    return this.dmsService.getWorkspaceDMChats(url, id, user.id, perPage, page);
  }

  @ApiOperation({ summary: '워크스페이스 특정 DM 채팅 생성하기' })
  @Post(':url/dms/:id/chats')
  async createWorkspaceDMChats(
    @Param('url') url,
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content,
    @User() user,
  ) {
    return this.dmsService.createWorkspaceDMChats(url, content, id, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 특정 DM 이미지 업로드하기' })
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @Post(':url/dms/:id/images')
  async createWorkspaceDMImages(
    @Param('url') url,
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],

    @User() user,
  ) {
    return this.dmsService.createWorkspaceDMImages(url, files, id, user.id);
  }

  @ApiOperation({ summary: '안 읽은 개수 가져오기' })
  @Get(':url/dms/:id/unreads')
  async getUnreads(
    @Param('url') url,
    @Param('id', ParseIntPipe) id: number,
    @Query('after', ParseIntPipe) after: number,
    @User() user,
  ) {
    return this.dmsService.getDMUnreadsCount(url, id, user.id, after);
  }
}
