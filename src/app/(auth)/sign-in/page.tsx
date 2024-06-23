'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"


export default function SignInForm(){
  const { toast } = useToast();
  const router = useRouter();

  //implemetning zod
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {       // by default form ko kaisa rakhna ahi
      identifier: '',
      password: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,          //we will do our custom redirection
      identifier: data.identifier,
      password: data.password
    })
    console.log(result);
    if (result?.error) {
      toast({
        title: "Login Failed",
        description: "incorrect username or password",
        variant: "destructive"
      })
    }

    // agar result me url aa raha hai matlab success hai
    if (result?.url) {
      router.replace('/dashboard')
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-bgColor">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <img
            src="/welcome.svg"
            alt="Login"
            className="w-28 h-28 mx-auto transition-transform transform hover:scale-105 delay-400"
          />
          <h1 className="text-4xl tracking-wide lg-text-3xl mb-2 mt-3 uppercase">Welcome</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email"
                    placeholder="test@test.com"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password"
                    placeholder="123456"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto flex justify-center items-center" >Sign-in
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Dont have an account?{' '}
            <Link href={'/sign-up'} className="text-orange-600 hover:text-orange-800">
              Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
