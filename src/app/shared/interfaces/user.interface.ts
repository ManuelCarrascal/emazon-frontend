export interface User {
  userName: string;
  userLastName: string;
  userIdentityDocument: string;
  userPhone: string;
  userEmail: string;
  userPassword: string;
  userBirthdate: string;
}

export interface UserResponse extends Omit<User, 'userPassword'> {
}
