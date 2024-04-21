import bcrypt from "bcryptjs";
import prisma from "@/lib/prismaClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // accessing the request body and converting it to json format
    const body = await request.json();

    const { email, name, password, username, profileImage } = body;

    if (!email || !name || !password || !username) {
      return new NextResponse("Missing Info, please provide email, name, password and username", { status: 404 });
    }

    const isUserAlreadyExists = await prisma.user.findFirst({
      where: { email: email },
    });

    if (isUserAlreadyExists) {
      return NextResponse.json({ status: false, message: "User already exists" });
    }

    // hashing the password using the bcrypt library
    const hashedPassword = await bcrypt.hash(password, 10);

    // add new user in the User collection
    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
        password: hashedPassword,
        profileImage
      },
    });

    return NextResponse.json({ success: true, message: "User added successfully", data: user});
  } catch (error: any) {
    console.log("REGISTRATION_ERROR", error);
    return NextResponse.json({ success: false, message: error.message});
  }
}
