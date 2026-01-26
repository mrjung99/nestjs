import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create.tweet.dto';
import { UpdateTweetDto } from './dto/update.tweet.dto';

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

  //* ------------------ update tweet ----------------------
  @Patch()
  updateTweet(@Body() updateTweet: UpdateTweetDto) {
    return this.tweetService.updateTweet(updateTweet);
  }

  //* ------------------ delete tweet ----------------------
  @Delete(':id')
  deleteTweet(@Param('id', ParseIntPipe) id: number) {
    return this.tweetService.deleteTweet(id);
  }
}
