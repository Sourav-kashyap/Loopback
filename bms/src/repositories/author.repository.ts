import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Author, AuthorRelations} from '../models';

export class AuthorRepository extends DefaultCrudRepository<
  Author,
  typeof Author.prototype.id,
  AuthorRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Author, dataSource);
  }
}
