"use client"
import { MessageCard } from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/model/User.model"
import { AcceptMesaageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Copy, CopyCheck, CopyIcon, CopySlash, Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const { toast } = useToast()

  function handleDeleteMessage(messageId: string | unknown) {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(AcceptMesaageSchema)
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message")
      setValue("acceptMessages", response?.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive"
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue, toast])

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true)
      setIsSwitchLoading(false)
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages")
        console.log(response.data.message);
        setMessages(response.data.message as any|| [])
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages"
          })
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
        setIsSwitchLoading(false)
      }
    },
    [setIsLoading, setMessages, toast]
  )

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, toast, fetchAcceptMessage, fetchMessages])

  async function handleSwitchChange() {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response.data.message || "updated succesfully",
        variant: "default"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive"
      })
    }
  }

  if (!session || !session.user) {
    return <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-4xl text-center font-bold tracking-wide">Please Login</h1>
    </div>
  }

  const { username } = session.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  function copyToClipboard() {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard."
    })
  }

  return (
    <>
      <h2 className="text-4xl p-4 mt-5 tracking-wider uppercase text-center text-gray-800 bg-gray-100 rounded shadow-lg">
        Welcome {username}
      </h2>
      <div className="my-8 lg:mx-auto p-6 bg-white rounded-lg shadow-md w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">My Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Copy Your Unique Link
          </h2>
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2 border border-gray-300 rounded"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2 text-gray-700">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator className="my-4 border-t border-gray-200" />
        <Button
          className="mt-4 border border-gray-300 text-gray-700 hover:bg-gray-100"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-700" />
          ) : (
            <RefreshCcw className="h-4 w-4 text-gray-700" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
      </div>
    </>
  );
  
}
