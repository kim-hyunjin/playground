import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private connection: Connection,
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ userId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const qr = this.connection.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const workspace = new Workspaces();
      workspace.name = name;
      workspace.url = url;
      workspace.OwnerId = myId;
      const savedWorkspace = await qr.manager
        .getRepository(Workspaces)
        .save(workspace);

      const workspaceMember = new WorkspaceMembers();
      workspaceMember.UserId = myId;
      workspaceMember.WorkspaceId = savedWorkspace.id;
      await qr.manager.getRepository(WorkspaceMembers).save(workspaceMember);

      const channel = new Channels();
      channel.name = '일반';
      channel.WorkspaceId = savedWorkspace.id;
      const savedChannel = await qr.manager
        .getRepository(Channels)
        .save(channel);

      const channelMember = new ChannelMembers();
      channelMember.UserId = myId;
      channelMember.ChannelId = savedChannel.id;
      await qr.manager.getRepository(ChannelMembers).save(channelMember);
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  // 쿼리 빌더 사용
  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getMany();
  }

  async createWorkspaceMembers(url, email) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });
    // 위와 같음
    // this.workspacesRepository
    //   .createQueryBuilder('workspace')
    //   .innerJoinAndSelect('workspace.Channels', 'channels')
    //   .where('url = :url', { url })
    //   .getOne();
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const qr = this.connection.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const workspaceMember = new WorkspaceMembers();
      workspaceMember.WorkspaceId = workspace.id;
      workspaceMember.UserId = user.id;
      await qr.manager.getRepository(WorkspaceMembers).save(workspaceMember);

      const channelMember = new ChannelMembers();
      channelMember.ChannelId = workspace.Channels.find(
        (v) => v.name === '일반',
      ).id;
      channelMember.UserId = user.id;
      await qr.manager.getRepository(ChannelMembers).save(channelMember);
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url,
      })
      .getOne();
  }
}
