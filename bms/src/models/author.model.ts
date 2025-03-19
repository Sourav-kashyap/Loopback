import {Entity, model, property, hasMany} from '@loopback/repository';
import {Book} from './book.model';

@model({settings: {strict: true}})
export class Author extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => Book) // Define the one-to-many relation
  books: Book[];

  constructor(data?: Partial<Author>) {
    super(data);
  }
}

export interface AuthorRelations {
  books?: Book[];
}

export type AuthorWithRelations = Author & AuthorRelations;
