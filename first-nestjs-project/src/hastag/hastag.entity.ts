import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hastag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  tag: string;
}
