export class GetUserResponseDto {
  id: string;
  username: string;
  password: "***";
  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
    this.password = "***";
  }
}
