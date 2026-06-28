import {
  Controller,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface JwtUser {
  sub: string;
  walletAddress: string;
  role: string;
}

@ApiTags('api-keys')
@ApiBearerAuth('JWT-auth')
@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @Throttle({ strict: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({ status: 201, description: 'API key successfully created' })
  async create(@Req() req: Request & { user: JwtUser }) {
    const rawKey = `sk_${randomBytes(32).toString('hex')}`;
    const prefix = rawKey.slice(0, 12);
    const keyHash = createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId: req.user.sub,
        name: `API Key ${new Date().toISOString().slice(0, 10)}`,
        keyHash,
        prefix,
        scope: 'read',
      },
    });

    // Return the raw key only once — it cannot be recovered after this response
    return {
      id: apiKey.id,
      key: rawKey,
      prefix: apiKey.prefix,
      scope: apiKey.scope,
      createdAt: apiKey.createdAt,
    };
  }

  @Delete(':id')
  @Throttle({ strict: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Revoke an API key' })
  @ApiResponse({ status: 200, description: 'API key successfully revoked' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async revoke(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtUser },
  ) {
    const result = await this.prisma.apiKey.updateMany({
      where: {
        id,
        userId: req.user.sub,
      },
      data: {
        isActive: false,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('API key not found');
    }

    return { message: 'API key revoked successfully' };
  }
}
