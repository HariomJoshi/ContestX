import { FetchState } from "./helper";

export interface UserSliceType {
  status: FetchState;
  error: String | undefined;
  data: UserType;
}

export interface UserType {
  id: number;
  name: String;
  username: String;
  email: String;
  ratingsChanged: number[];
}

export interface AuthStateType {
  token: String | null;
}

export type Contest = {
  id: string;
  title: string;
  description: string;
  startAt: string; // ISO date string indicating contest start
  endsAt: string; // ISO date string indicating contest end
};

export type ContestsPageProps = {
  contests: Contest[];
};

export type Question = {
  id: number;
  title: string;
  tags: string[];
};

export type Blogs = {
  title: String;
  description: String;
  imageUrl: String;
  Content: JSON;
};
