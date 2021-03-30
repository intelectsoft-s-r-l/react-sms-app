import HttpService from "api/";
import { ApiResponse } from "api/types";
import { API_AUTH_URL } from "configs/AppConfig";
import { AuthorizeUser } from "./types";

export class AuthService extends HttpService {
  constructor() {
    super(API_AUTH_URL);
  }

  public Login = async (Email: string, Password: string) =>
    this.instance.post<AuthorizeUser>("/AuthorizeUser", {
      Email,
      Password,
    });

  public ChangePassword = async (NewPassword: string, OldPassword: string) =>
    this.instance.post<ApiResponse>("/ChangePassword", {
      NewPassword,
      OldPassword,
    });

  public GetProfileInfo = async () => this.instance.get<any>("/GetProfileInfo");
}
