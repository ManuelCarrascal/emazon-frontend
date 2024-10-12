import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { CategoryService } from '@/app/modules/dashboard/services/category.service';
import { Category } from '@/app/modules/dashboard/interfaces/category.interface';

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

        service.createCategory(dummyCategory).subscribe((response) => {
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

        const page = 0;
        const size = 10;
        const sortBy = 'categoryName';
        const isAscending = true;

        service.getCategories(page, size, sortBy, isAscending).subscribe((response: { content: Category[] }) => {
            expect(response.content.length).toBe(2);
            expect(response.content).toEqual(dummyCategories);
        });

        const req = httpMock.expectOne(req => 
            req.url === service['apiUrl'] &&
            req.params.get('page') === page.toString() &&
            req.params.get('size') === size.toString() &&
            req.params.get('sortBy') === sortBy &&
            req.params.get('isAscending') === isAscending.toString()
        );
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('Authorization')).toBe(`Bearer ${environment.auth_token}`);
        req.flush({ content: dummyCategories });
    });
});