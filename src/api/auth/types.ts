import { ApiDecorator, ApiResponse } from "api/types";
export type AuthorizeUser = ApiDecorator<ApiResponse, "Token", string>;
