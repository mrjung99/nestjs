import { Tweet } from 'src/tweet/tweet.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Hastag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  tag: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Tweet, (tweet) => tweet.hastags, { onDelete: 'CASCADE' })
  tweets: Tweet;
}
