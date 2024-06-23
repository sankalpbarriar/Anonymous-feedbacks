'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, LoaderCircle, LoaderPinwheel, LucideLoaderCircle } from "lucide-react"


export default function SignUpForm() {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')  //backend se koi msg aaya to
    const [isCheckingUsername, setIsCheckingUsername] = useState(false) //loading state...
    const [isSubmitting, setIsSubmitting] = useState(false)

    // debouncing technique --> since we do not want to check uniqness on every key press isliye hum imediatelly state me kuch change ho raha hai uske hisab se na kar ke deboundedUsername se karenge(request fire to backend)
    const debounced = useDebounceCallback(setUsername, 3000)
    const { toast } = useToast();
    const router = useRouter();

    //implemetning zod
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {       // by default form ko kaisa rakhna ahi
            username: '',
            email: '',
            password: '',
        }
    });

    //is username available
    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);  //abhi chal rahi hai checking
                setUsernameMessage('')   //last time request ki error ko empty kar do
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    let message = response.data.message;
                    console.log(message);
                    setUsernameMessage(message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    )

                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);     //kaam kar raha hu abhi loader laga lo
        try {
            //passing the data
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            console.log(response);
            toast({
                title: 'Success',
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
            setIsSubmitting(false);
        } catch (error) {
            console.log('Error in signing up', error);
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            })
            setIsSubmitting(false);

        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-bgColor">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                <img 
                src="/login2.svg" 
                alt="Login" 
                className="w-28 h-28 mx-auto transition-transform transform hover:scale-105 delay-400"
            />
            <h1 className="text-4xl tracking-wider lg-text-3xl mb-2 mt-4 uppercase">Register</h1>
                </div>  
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }} />
                                    </FormControl>
                                    {isCheckingUsername && <LucideLoaderCircle className="animate-apin" />}
                                    <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-300'}`}>{usernameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
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
                        <Button type="submit"  className="w-full sm:w-auto flex justify-center items-center" disabled={isSubmitting}>
                            {/* manipulating text */}
                            {
                                isSubmitting ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Please wait..
                                    </>
                                ) : ('Signup')
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already have an account?{' '}
                        <Link href={'/sign-in'} className="text-orange-600 hover:text-orange-800">
                            Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
