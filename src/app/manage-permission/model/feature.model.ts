import { FeatureAction } from './feature-action.model';

export interface Feature {
  featureId: string;
  featureName: string;
  featureDisplayName: string;
  featureGroupId: string;
  featureActionList: FeatureAction[];
}
