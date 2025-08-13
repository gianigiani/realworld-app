import { Profile } from '../../profile/model/profile.model';

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tagList: string[];
  author: Profile;
  favorited: boolean;
  favoritesCount: number;
}
