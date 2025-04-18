import { Feature } from './feature.model';

export interface FeatureGroup {
  groupId: string;
  groupName: string;
  groupDisplayName: string;
  featureList: Feature[];
}
