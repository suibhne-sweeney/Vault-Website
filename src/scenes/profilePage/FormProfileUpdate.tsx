"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/aceternityui/file-upload"
import { useDispatch } from "react-redux"
import { setLogin } from "@/state"

const playlistSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long." })
    .max(30, { message: "First name must be less than 30 characters long." })
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long." })
    .max(30, { message: "Last name must be less than 30 characters long." })
    .optional()
    .or(z.literal("")),
  image: z.string().optional(),
  picture: z.any().optional(),
})

const ProfileUpdate = (props: { id: string; token: string }) => {
  const { id, token } = props
  const { toast } = useToast()
  const SERVER_URI = import.meta.env.VITE_SERVER_URI
  const dispatch = useDispatch()
  const [editFirstName, setEditFirstName] = useState(false)
  const [editLastName, setEditLastName] = useState(false)
  const [editPicture, setEditPicture] = useState(false)

  const form = useForm<z.infer<typeof playlistSchema>>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      image: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof playlistSchema>) => {
    const formData = new FormData()

    if (editFirstName && values.firstName) {
      formData.append("firstName", values.firstName)
    }
    if (editLastName && values.lastName) {
      formData.append("lastName", values.lastName)
    }
    if (editPicture && values.image) {
      formData.append("image", values.image)
    }
    if (editPicture && values.picture) {
      formData.append("picture", values.picture)
    }

    const response = await fetch(`${SERVER_URI}/api/users/${id}/update`, {
      method: "PATCH",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()

    if (!data.error) {
      toast({
        title: "Success",
        description: "Your profile has been updated!",
      })
      dispatch(setLogin({token: token, user: data }))
      setTimeout(function(){
        location.reload()
      }, 1000);

    } else {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Edit First Name Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="editFirstName"
            checked={editFirstName}
            onCheckedChange={() => setEditFirstName(!editFirstName)}
          />
          <label
            htmlFor="editFirstName"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Edit First Name
          </label>
        </div>
        {editFirstName && (
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormDescription>Update your first name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Edit Last Name Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox id="editLastName" checked={editLastName} onCheckedChange={() => setEditLastName(!editLastName)} />
          <label
            htmlFor="editLastName"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Edit Last Name
          </label>
        </div>
        {editLastName && (
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormDescription>Update your last name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Edit Picture Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox id="editPicture" checked={editPicture} onCheckedChange={() => setEditPicture(!editPicture)} />
          <label
            htmlFor="editPicture"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Upload New Picture
          </label>
        </div>
        {editPicture && (
          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <FileUpload
                    {...field}
                    onChange={(files) => {
                      const file = files[0]
                      form.setValue("picture", file)
                      form.setValue("image", file.name)
                      field.onChange(file)
                    }}
                  />
                </FormControl>
                <FormDescription>Upload your new profile picture.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default ProfileUpdate
