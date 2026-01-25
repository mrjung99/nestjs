import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateTweetDto } from './dto/create.tweet.dto';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
    private userService: UsersService,
  ) {}

  //*---------------- create tweet --------------------
  async createTweet(createTweetDto: CreateTweetDto) {
    // find user
    const user = await this.userService.getUserById(createTweetDto.userId);
    if (!user) {
      return `User with the id: ${createTweetDto.userId} doen't exist!!`;
    }

    //create tweet
    const tweet = this.tweetRepository.create({
      ...createTweetDto,
      user,
    });

    //save
    return await this.tweetRepository.save(tweet);
  }
}
