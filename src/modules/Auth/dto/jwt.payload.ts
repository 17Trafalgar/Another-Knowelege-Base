export interface JwtPayload {
  userId: number;
  email: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}
