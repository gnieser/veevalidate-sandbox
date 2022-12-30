export class User {
  id?: number;
  name?: string;
  roles?: Array<Role>;
}

export class Role {
  label?: string;
}
