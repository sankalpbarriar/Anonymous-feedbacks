import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

//making querySchema
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

//koi bhi ye agar username bheje to hum ye bata paye ki ye vakid hai ki nahi while typing

export async function GET(request: Request) {
  await dbConnect();

  try {
    //checking username thorugh query url
    const {searchParams}=new URL(request.url)
    const queryParams={
        username:searchParams.get('username')
    }
  } catch (error) {
    console.error("Error checking username ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
