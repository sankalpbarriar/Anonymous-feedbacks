import { getServerSession } from "next-auth"; // to know who is logged in
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function GET(request: Request) {
  await dbConnect();

  try {
    // Query to fetch usernames where isAcceptingMessage is true
    const users = await UserModel.find({ isAcceptingMessage: true }, { username: 1, _id: 0 });

    // Extract usernames from the query result
    const usernames = users.map(user => user.username);

    // Return the usernames as a JSON response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Usernames fetched successfully",
        data: usernames,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.log('An unexpected error occurred', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch usernames",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
