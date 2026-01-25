import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create.tweet.dto';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  //* ------------------ get tweet ------------------------
  @Get(':id')
  async getTweet(@Param('id', ParseIntPipe) uerId: number) {
    return this.tweetService.getTweet(uerId);
  }

  //* ------------------Post method for tweet---------------
  @Post()
  createTweet(@Body() tweet: CreateTweetDto) {
    return this.tweetService.createTweet(tweet);
  }
}
