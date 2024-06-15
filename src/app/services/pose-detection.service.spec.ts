import { TestBed } from '@angular/core/testing';
import { PoseDetectionService } from './pose-detection.service';
// @ts-ignore
import PoseExercise, {getExercisesList, exerciseResultFromRGBArray, exerciseResult} from '@oktics/oktics-health-pose';
describe('PoseDetectionService', () => {
  let service: PoseDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoseDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('There are registered exercises and it is an array.', async () => {
    const result = await service.getExercisesList();
    expect(result.length).toBeGreaterThan(0);
    expect(Array.isArray(result)).toBeTrue();
  });
});
