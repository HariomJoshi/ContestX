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
