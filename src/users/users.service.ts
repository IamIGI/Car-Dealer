import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // repo is going to by instance of typeorm repo with User instance
  // InjectRepository(<entity>) -  we need user repository
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    //Logic from entity 'User' is executed when you use 'create'
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  findByEmail(email: string) {
    return this.repo.find({ where: { email } });
  }

  //allow to update with object that have just the part of the User class properties
  async update(id: number, attrs: Partial<User>) {
    const userToUpdate = await this.findOne(id);
    if (!userToUpdate) throw new NotFoundException('user not found');

    Object.assign(userToUpdate, attrs);
    return this.repo.save(userToUpdate);
  }

  async remove(id: number) {
    const userToDelete = await this.findOne(id);
    if (!userToDelete) throw new NotFoundException('user not found');
    return this.repo.remove(userToDelete);
  }
}
