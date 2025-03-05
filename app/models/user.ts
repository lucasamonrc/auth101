export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
}
