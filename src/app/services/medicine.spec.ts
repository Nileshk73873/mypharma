import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MedicineService } from './medicine';

describe('MedicineService', () => {
  let service: MedicineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()]
    });

    service = TestBed.inject(MedicineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
