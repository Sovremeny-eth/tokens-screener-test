import { BadRequestException, Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

import { BackendService, NameType } from './backend.service.js';
import { TokensQuery, TokensQueryDto, TokensResponseDto } from './dto/index.js';
import { UserIpInterceptor } from './user-ip.interceptor.js';

@ApiTags('Tokens')
@Controller('tokens')
@ApiExtraModels(TokensQueryDto)
@UseInterceptors(UserIpInterceptor)
export class BackendController {
  readonly #backendService: BackendService;

  constructor(backendService: BackendService) {
    this.#backendService = backendService;
  }

  @ApiQuery({ name: 'symbol', type: String, required: false })
  @ApiQuery({ name: 'address', type: String, required: false })
  @ApiQuery({ name: 'pair', type: String, required: false })
  @ZodSerializerDto(TokensResponseDto)
  @ApiOkResponse({ type: TokensResponseDto, description: 'Get token metadata for other chains' })
  @Get('/')
  async getTokenMetadata(@Query() query: TokensQueryDto): Promise<TokensResponseDto> {
    const tokensQuery = Object.keys(query).filter(
      (key) => query[key as keyof TokensQuery] !== undefined,
    );

    if (tokensQuery.length === 0) {
      throw new BadRequestException('Missing query parameters');
    }

    if (tokensQuery.length > 1) {
      throw new BadRequestException('Only one query parameter is allowed');
    }

    const name = tokensQuery[0]!;

    if (!Object.values(NameType).includes(name as never)) {
      throw new BadRequestException(`Invalid query parameter: ${name}`);
    }

    const data = query[name as keyof TokensQuery]!.trim();

    return await this.#backendService.getTokenMetadata({ name: name as NameType, data });
  }
}
