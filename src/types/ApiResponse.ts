//jab bhi hum response bhejenge wo is type ko follow karni chaiye
import { Message } from "@/model/User.model";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?:boolean;
    messages?:Array<Message>;  //optional bana do taki agar bhejan hai tabhi bhejo
}