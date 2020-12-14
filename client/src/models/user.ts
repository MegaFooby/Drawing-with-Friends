export default class User {
    firstName: string;
    lastName: string
    username: string;
    password: string;
    admin: boolean;
    constructor(firstname: string, lastname: string, username: string, password: string, admin: boolean) {
      this.firstName = firstname;
      this.lastName = lastname;
      this.username = username;
      this.password = password;
      this.admin = admin;
    }

    name() {
      return this.firstName + this.lastName;
    }
  }