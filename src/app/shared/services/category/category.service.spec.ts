import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category, CategoryResponse, Pagination } from '../../interfaces/category.interface';
import { HttpResponse } from '@angular/common/http';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a category', () => {
    const dummyCategory: Category = { categoryName: 'Test', categoryDescription: 'Test Description' };
    const dummyResponse: HttpResponse<Category> = new HttpResponse({ body: dummyCategory });

    service.createCategory(dummyCategory).subscribe(response => {
      expect(response.body).toEqual(dummyCategory);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(dummyCategory, { status: 201, statusText: 'Created' });
  });

  it('should get categories with pagination', () => {
    const dummyPagination: Pagination<CategoryResponse> = {
      content: [{ categoryId: 1, categoryName: 'Test', categoryDescription: 'Test Description' }],
      totalElements: 1,
      totalPages: 1,
      currentPage: 0,
      isAscending: true
    };

    service.getCategories(0, 1, 'categoryName', true).subscribe(response => {
      expect(response).toEqual(dummyPagination);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?page=0&size=1&sortBy=categoryName&isAscending=true`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPagination);
  });

  it('should get all categories', () => {
    const dummyCategories: CategoryResponse[] = [{ categoryId: 1, categoryName: 'Test', categoryDescription: 'Test Description' }];

    service.getAllCategories().subscribe(response => {
      expect(response).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/all`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });
});