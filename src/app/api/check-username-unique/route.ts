import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

//1. query ka schema
//2. query nikalna hoga
//3. safeParse(queryParams)

//making querySchema
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

//koi bhi ye agar username bheje to hum ye bata paye ki ye vakid hai ki nahi while typing

export async function GET(request: Request) {
  await dbConnect();

  //localhost:3000/api/cuu?username=sankalp
  try {
    //checking username through query url in NextJs
    const { searchParams } = new URL(request.url); //url aagaya
    const queryParams = {
      //ab searchParams me se apna query nikalna hai
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    console.log(result);
    //agar result sahi nahi aaya
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );

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
