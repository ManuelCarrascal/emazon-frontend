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

export interface UserLogin extends Pick<User, 'userEmail' | 'userPassword'> {
}

export interface UserLoginResponse {
  token: string;

}

export interface TokenPayload {
  email: string;
  authorities: string;
  sub: string;
  iat: number;
  exp: number;
}