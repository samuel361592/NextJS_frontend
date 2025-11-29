import { Post } from "./post";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  posts: Post[];
  roles: string[]; // 前端簡化處理，用字串陣列表示角色（如果有需要也可以改成 Role type）
}
