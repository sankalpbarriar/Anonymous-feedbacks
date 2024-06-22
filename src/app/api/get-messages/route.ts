import { getServerSession } from "next-auth"; //to know who is logged in
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

//Route to show messages
export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  //agar user present na ho
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id); //agar ye string bhi hua to userId me jo jayega wo mongoose ka ObjectId hoga

  try {
    //aggregation pipeline
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createAt": -1 } },
      //ab group kar ke bhej do
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userMessages || userMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No Messages"
        },
        {
          status: 404
        }
      )
    }
    // send messages
    return Response.json(
      {
        success: true,
        message: userMessages[0].messages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.log('An unexpected error occurred', error);
    return Response.json(
        {
          success: false,
          message: "An unexpected error occurred",
        },
        { status: 500 }  //internal server error
      );
  }
}
