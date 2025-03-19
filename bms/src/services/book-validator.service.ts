import {injectable, inject, BindingScope} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  BookRepository,
  AuthorRepository,
  CategoryRepository,
} from '../repositories';
import {Book} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class BookValidatorService {
  constructor(
    @inject('repositories.BookRepository')
    private readonly bookRepo: BookRepository,
    @inject('repositories.AuthorRepository')
    private readonly authorRepo: AuthorRepository,
    @inject('repositories.CategoryRepository')
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async validateIsbn(isbn: string): Promise<void> {
    const isbnRegex = /^\d{4,7}$/;

    if (!isbnRegex.test(isbn)) {
      throw new HttpErrors.BadRequest('ISBN must be between 4 and 7 digits.');
    }

    const ExistingBook = await this.bookRepo.find({where: {isbn: isbn}});
    if (ExistingBook) {
      throw new HttpErrors.BadRequest(
        `Book with this isbn: ${isbn} is already present in the db`,
      );
    }
  }

  validatePrice(price: number): void {
    if (price <= 0) {
      throw new HttpErrors.BadRequest('Price must be greater than zero.');
    }
  }

  validatePublishDate(publishDate: string): void {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(publishDate)) {
      throw new HttpErrors.BadRequest(
        'Publish Date must be in the format YYYY-MM-DD.',
      );
    }
  }

  validateBookId(bookId: string): void {
    if (!bookId || bookId.trim().length === 0) {
      throw new HttpErrors.BadRequest('Book ID cannot be empty.');
    }

    if (bookId.length < 2 || bookId.length > 50) {
      throw new HttpErrors.BadRequest(
        'Book ID must be between 3 and 50 characters.',
      );
    }
  }

  validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new HttpErrors.BadRequest('Title cannot be empty.');
    }

    if (title.length < 3 || title.length > 100) {
      throw new HttpErrors.BadRequest(
        'Title must be between 3 and 100 characters.',
      );
    }
  }

  async validateAuthorId(authorId: string): Promise<void> {
    if (!authorId || authorId.trim().length === 0) {
      throw new HttpErrors.BadRequest('Author ID cannot be empty.');
    }

    const isAuthorPresent = await this.authorRepo.exists(authorId);
    if (!isAuthorPresent) {
      throw new HttpErrors.BadRequest(`Author id ${authorId} not found`);
    }
  }

  async validateCategoryId(categoryId: string): Promise<void> {
    if (!categoryId || categoryId.trim().length === 0) {
      throw new HttpErrors.BadRequest('Category ID cannot be empty.');
    }
    const isCategoryPresent = await this.categoryRepo.exists(categoryId);
    if (!isCategoryPresent) {
      throw new HttpErrors.BadRequest(`Category id ${categoryId} not found`);
    }
  }

  async validateBook(book: Book): Promise<void> {
    this.validateBookId(book.bookId);
    this.validateTitle(book.title);
    await this.validateIsbn(book.isbn);
    this.validatePrice(book.price);
    this.validatePublishDate(book.publishDate);
    await this.validateAuthorId(book.authorId);
    await this.validateCategoryId(book.categoryId);
  }
}
