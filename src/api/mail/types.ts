import { ApiDecorator, ApiResponse } from "api/types";

export type ContactList = {
  Description?: string;
  Email?: boolean;
  ID?: number;
  Name: string;
  Phone?: boolean;
  ContactsData?: string;
};

export type ContactListResponse<T> = ApiDecorator<
  ApiResponse,
  "ContactsList",
  T
>;
