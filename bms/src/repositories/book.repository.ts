import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Book, BookRelations, Author, Category} from '../models';
import {AuthorRepository} from './author.repository';
import {CategoryRepository} from './category.repository';

export class BookRepository extends DefaultCrudRepository<
  Book,
  typeof Book.prototype.bookId,
  BookRelations
> {
  public readonly author: BelongsToAccessor<
    Author,
    typeof Book.prototype.bookId
  >;
  public readonly category: BelongsToAccessor<
    Category,
    typeof Book.prototype.bookId
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('AuthorRepository')
    protected authorRepositoryGetter: Getter<AuthorRepository>,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Book, dataSource);

    this.author = this.createBelongsToAccessorFor(
      'author',
      authorRepositoryGetter,
    );
    this.registerInclusionResolver('author', this.author.inclusionResolver);

    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
