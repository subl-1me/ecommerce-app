import { TestBed } from '@angular/core/testing';

import { CloudinaryUploadsService } from './cloudinary-uploads.service';

describe('CloudinaryUploadsService', () => {
  let service: CloudinaryUploadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinaryUploadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
