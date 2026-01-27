import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateTweetDto } from './dto/create.tweet.dto';
import { HastagService } from 'src/hastag/hastag.service';
import { UpdateTweetDto } from './dto/update.tweet.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

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
        hastags: true,
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

  //* ------------------- update tweet ------------------
  async updateTweet(updateTweet: UpdateTweetDto) {
    // get tweet
    const tweet = await this.tweetRepository.findOneBy({ id: updateTweet.id });
    if (!tweet) {
      throw new NotFoundException(
        `Tweet with the id: ${updateTweet.id} doesn't found!!`,
      );
    }
    // creates objets for tweet
    if (updateTweet.text !== undefined) {
      tweet.text = updateTweet.text;
    }

    if (updateTweet.image !== undefined) {
      tweet.image = updateTweet.image;
    }

    if (updateTweet.hastags !== undefined) {
      const hastags = await this.hastagService.getHastagArray(
        updateTweet.hastags,
      );
      tweet.hastags = hastags;
    }

    //save the changes
    return await this.tweetRepository.save(tweet);
  }

  //* ------------------------delete tweet ---------------------
  async deleteTweet(id: number) {
    const tweet = this.tweetRepository.findOneBy({ id });
    if (!tweet) {
      throw new NotFoundException(`A tweet with the id:${id} doesn't exist.`);
    }

    return await this.tweetRepository.delete({ id });
  }
}
