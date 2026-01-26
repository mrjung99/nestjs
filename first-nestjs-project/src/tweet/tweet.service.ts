import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateTweetDto } from './dto/create.tweet.dto';
import { HastagService } from 'src/hastag/hastag.service';
import { UpdateTweetDto } from './dto/update.tweet.dto';

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
    // get hastags
    updateTweet.hastags = updateTweet.hastags ?? []; // if the hastags comming from the user is null or undefined it will assign empty array
    const hastags = await this.hastagService.getHastagArray(
      updateTweet.hastags,
    );

    // get tweet
    const tweet = await this.tweetRepository.findOneBy({ id: updateTweet.id });
    if (!tweet) {
      throw new NotFoundException(
        `Tweet with the id: ${updateTweet.id} doesn't found!!`,
      );
    }
    // creates objets for tweet
    tweet.text = updateTweet.text ?? tweet.text;
    tweet.image = updateTweet.image ?? tweet.image;
    tweet.hastags = hastags;

    //save the changes
    const respose = await this.tweetRepository.save(tweet);

    // send response
    return {
      status: 'success',
      message: 'Tweet updated successfully.',
      data: { tweet: respose },
    };
  }
}
