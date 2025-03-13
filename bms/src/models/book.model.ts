import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Author} from './author.model';
import {Category} from './category.model';

@model({settings: {strict: false}})
export class Book extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  bookId: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  isbn: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
    required: true,
  })
  publishDate: string;

  @belongsTo(() => Author) // Define the many-to-one relation
  authorId: string;

  @belongsTo(() => Category) // Define the many-to-one relation
  categoryId: string;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
  author?: Author;
  category?: Category;
}

export type BookWithRelations = Book & BookRelations;
