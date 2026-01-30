import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create.tweet.dto';
import { UpdateTweetDto } from './dto/update.tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination.query.dto';
import { AuthorizedGuard } from 'src/auth/guard/authorized.guard';
import { ActiveUser } from 'src/auth/decorator/activeUser.decorator';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  //* ------------------ get tweet ------------------------
  @Get(':id')
  async getTweet(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.tweetService.getTweet(id, paginationQueryDto);
  }

  //* ------------------Post method for tweet---------------
  @Post()
  createTweet(@Body() tweet: CreateTweetDto, @ActiveUser('sub') userId) {
    return this.tweetService.createTweet(tweet, userId);
  }

  //* ------------------ update tweet ----------------------
  @Patch()
  async updateTweet(@Body() updateTweet: UpdateTweetDto) {
    const response = await this.tweetService.updateTweet(updateTweet);
    // send response
    return {
      status: 'success',
      message: 'Tweet updated successfully.',
      data: { tweet: response },
    };
  }

  //* ------------------ delete tweet ----------------------
  @Delete(':id')
  async deleteTweet(@Param('id', ParseIntPipe) id: number) {
    await this.tweetService.deleteTweet(id);

    return {
      status: 'success',
      message: `Tweet with the id:${id} has been deleted successfully!!`,
    };
  }
}
