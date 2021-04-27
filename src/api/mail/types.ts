import { ApiDecorator, ApiResponse } from "api/types";

export type ContactList = {
  Description?: string;
  Email?: number;
  ID?: number;
  Name: string;
  Phone?: number;
  ContactsData?: string;
  CreateDate?: any;
};

export type ContactListsResponse = ApiDecorator<
  ApiResponse,
  "ContactsLists",
  ContactList[]
>;
export type ContactListResponse = ApiDecorator<
  ApiResponse,
  "ContactsList",
  ContactList
>;
