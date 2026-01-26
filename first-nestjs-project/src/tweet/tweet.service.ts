import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateTweetDto } from './dto/create.tweet.dto';
import { HastagService } from 'src/hastag/hastag.service';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
    private userService: UsersService,
    private hastagService: HastagService,
  ) {}

  //* ------------- get tweet of the user -----------------
  async getTweet(userId: number) {
    const tweets = await this.tweetRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true,
      },
    });

    if (!tweets.length) {
      throw new NotFoundException(`No tweet with the user id: ${userId}`);
    }

    return tweets;
  }

  //*---------------- create tweet --------------------
  async createTweet(createTweetDto: CreateTweetDto) {
    // find user
    const user = await this.userService.getUserById(createTweetDto.userId);
    if (!user) {
      return `User with the id: ${createTweetDto.userId} doen't exist!!`;
    }

    const hastags = await this.hastagService.getHastagArray(
      createTweetDto.hastags,
    );
    //create tweet
    const tweet = this.tweetRepository.create({
      ...createTweetDto,
      user,
      hastags,
    });

    //save
    return await this.tweetRepository.save(tweet);
  }
}
