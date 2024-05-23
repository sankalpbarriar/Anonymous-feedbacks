import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    //kya koi aisa user hai jiska username bhi hai aur verified bhi hai
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken!",
        },
        {
          status: 400,
        }
      );
    }

    //finding user by email
    const existingUserByEmail = await UserModel.findOne({ email });
    //creating verify code
    const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

    // YAHAN pe 2 BAATE HOJATI HAI   1. Ya to user verfied ho  2. ya fir na ho
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user already exists with the email",
          },
          {
            status: 400,
          }
        );
      } else {
        const hasedPassword = await bcrypt.hash(password, 10);
        //overwrite password
        existingUserByEmail.password = hasedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      //user aaya hi pehli baar hai--> TO naya user bana do
      const hasshedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(); //object ke piche let,const kuch bhi ho usko farq nahi padta
      expiryDate.setHours(expiryDate.getHours() + 2);

      //creating model

      const newUser = new UserModel({
        username,
        email,
        password: hasshedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "user registered successfully please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error registering user", error); //for console
    return Response.json(
      {
        //for frontend
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
