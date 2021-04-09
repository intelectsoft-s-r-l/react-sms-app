import { ApiResponse } from "api/types";
import { API_MAIL_URL } from "configs/AppConfig";
import HttpService from "../";
import {
  ContactList,
  ContactListResponse,
  ContactListsResponse,
} from "./types";

export class MailService extends HttpService {
  constructor() {
    super(API_MAIL_URL);
    this.instance.interceptors.request.use((config) => {
      return {
        ...config,
        auth: { username: "1", password: "1" },
      };
    });
  }
  public GetContactLists = async () =>
    this.instance.get<ContactListsResponse>(`/GetContactLists`);

  public GetContactList = async (ID: number) =>
    this.instance.get<ContactListResponse>(`/GetContactList`, {
      params: { ID }, // FIXME: This might cause the spread incorrect operator bug
    });

  public UpdateContactList = async (data: ContactList) =>
    this.instance.post<ApiResponse>(`/UpdateContactList`, data);
}
