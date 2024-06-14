import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    //find user
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    //agar mil gaya to
    //is user accepting the message
    if (!user.isAcceptingMessage) {
      console.log("User is not accepting the message");
      return Response.json(
        {
          success: false,
          message: "User is not accepting the message",
        },
        { status: 403 } //forbidden
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
        {
          success: true,
          message: "Message sent succesfully",
        },
        { status: 200 }
      );
  } catch (error) {
    console.log('Error in sending message',error)
    return Response.json(
        {
          success: false,
          message: "Internal server error",
        },
        { status: 500 }
      );
  }
}
