export default class User {
    firstName: string;
    lastName: string
    username: string;
    password: string;
    constructor(firstname: string, lastname: string, username: string, password: string) {
      this.firstName = firstname;
      this.lastName = lastname;
      this.username = username;
      this.password = password;
    }

    name() {
      return this.firstName + this.lastName;
    }
  }