import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../interfaces/category.interface';
import { environment } from 'src/environments/environment';

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

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create a category', () => {
        const dummyCategory: Category = { categoryName: 'Test Category', categoryDescription: 'Description' };
    

        service.createCategory(dummyCategory).subscribe(response => {
            expect(response.body).toEqual(dummyCategory);
        });

        const req = httpMock.expectOne(service['apiUrl']);
        expect(req.request.method).toBe('POST');
        expect(req.request.headers.get('Authorization')).toBe(`Bearer ${environment.auth_token}`);
        expect(req.request.headers.get('Content-Type')).toBe('application/json');
        req.flush(dummyCategory, { status: 201, statusText: 'Created' });
    });

    it('should get categories', () => {
        const dummyCategories: Category[] = [
            { categoryName: 'Category 1', categoryDescription: 'Description 1' },
            { categoryName: 'Category 2', categoryDescription: 'Description 2' }
        ];
      

        service.getCategories().subscribe(categories => {
            expect(categories.length).toBe(2);
            expect(categories).toEqual(dummyCategories);
        });

        const req = httpMock.expectOne(service['apiUrl']);
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('Authorization')).toBe(`Bearer ${environment.auth_token}`);
        req.flush({ content: dummyCategories });
    });
});