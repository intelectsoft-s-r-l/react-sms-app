import HttpService from "api/";
import { ApiDecorator, ApiResponse } from "api/types";
import { API_PORTAL_URL } from "configs/AppConfig";
import { IApp } from "api/client/types";

type GetAppInfoType = ApiDecorator<ApiResponse, "MarketAppList", IApp[]>;
type GenerateApiKeyType = ApiDecorator<ApiResponse, "ApiKey", string>;
export class PortalService extends HttpService {
  constructor() {
    super(API_PORTAL_URL);
  }

  public GetAppInfo = async () =>
    this.instance.get<GetAppInfoType>("/GetMarketAppList");

  public GenerateApiKey = async (AppID: number) =>
    this.instance.post<GenerateApiKeyType>("/GenerateApiKey", { AppID });

  public DeleteApiKey = async (AppID: number) =>
    this.instance.post<ApiResponse>("/DeleteApiKey", { AppID });
}
