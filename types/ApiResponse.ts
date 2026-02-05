import {Message} from "@/model/userModel";

export interface ApiResponse {
  success: boolean;
  message: string | Array<Message>;
  isAcceptingMessages?: boolean;
  data?: unknown;
}
