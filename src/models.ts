export class User {

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.roles = new Array<Role>();
  }

  id: number;
  name: string;
  roles: Array<Role>;
}

export class Role {

  constructor(label: string) {
    this.label = label;
  }

  label?: string;
}
