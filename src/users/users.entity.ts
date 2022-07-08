import { Report } from 'src/reports/reports.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted user:', this);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user:', this);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user:', this);
  }
}
