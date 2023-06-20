import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
    const { name, email, password } = await req.json();

    const exists = await db.user.findUnique({
        where: {
            email,
        }
    });

    if(exists){
        return NextResponse.json({
            status: 'error',
            message: "User already exists",
            data: null
        }, { status: 400 });        
    } else {
        const user = await db.user.create({
            data: {
              name,
              email,
              password: await hash(password, 10),
            },
          });
          return NextResponse.json({
            status: 'success',
            message: "User successfully created. Redirecting...",
            data: user,
        }, { status: 200 });    
    }
}