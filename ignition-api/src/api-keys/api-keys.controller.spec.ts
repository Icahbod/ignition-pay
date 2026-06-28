import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiKeysController } from './api-keys.controller';

describe('ApiKeysController', () => {
  let controller: ApiKeysController;
  let prisma: {
    apiKey: {
      create: jest.Mock;
      updateMany: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      apiKey: {
        create: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    controller = new ApiKeysController(prisma as unknown as PrismaService);
  });

  it('creates a new API key for the authenticated user', async () => {
    prisma.apiKey.create.mockResolvedValue({
      id: 'api-key-1',
      prefix: 'sk_12345678',
      scope: 'read',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    const result = await controller.create({
      user: {
        sub: 'user-1',
        walletAddress: 'GABC',
        role: 'USER',
      },
    } as never);

    expect(prisma.apiKey.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          scope: 'read',
          prefix: expect.stringMatching(/^sk_/),
          keyHash: expect.any(String),
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'api-key-1',
        key: expect.stringMatching(/^sk_/),
        prefix: 'sk_12345678',
        scope: 'read',
      }),
    );
  });

  it('revokes an owned API key and hides ownership details', async () => {
    prisma.apiKey.updateMany.mockResolvedValue({ count: 1 });

    const result = await controller.revoke('api-key-1', {
      user: {
        sub: 'user-1',
        walletAddress: 'GABC',
        role: 'USER',
      },
    } as never);

    expect(prisma.apiKey.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'api-key-1',
          userId: 'user-1',
        },
        data: {
          isActive: false,
        },
      }),
    );
    expect(result).toEqual({ message: 'API key revoked successfully' });
  });

  it('returns not found when the key does not exist or is not owned by the caller', async () => {
    prisma.apiKey.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      controller.revoke('api-key-1', {
        user: {
          sub: 'user-2',
          walletAddress: 'GDEF',
          role: 'USER',
        },
      } as never),
    ).rejects.toThrow(NotFoundException);
  });
});