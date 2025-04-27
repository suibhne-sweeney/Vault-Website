import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { useState } from "react";
// import { FileUpload } from "@/components/aceternityui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/aceternityui/file-upload";

const playlistSchema = z.object({
  name: z.string()
    .min(2, { message: "Playlist name must be at least 2 characters long." })
    .max(30, { message: "Playlist name must be less than 30 characters long." }),
  image: z.string(),
  description: z.string(),
  songs: z.array(z.string()),
  picture: z.instanceof(File, { message: "Cover image is required." })
    .refine((file) => file.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported."
    ),
}) 

const PlaylistUpload = (props: {id: string, token: string, songId: string }) => {
  const { id, token, songId } = props;
  const { toast } = useToast()
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;

  const form = useForm<z.infer<typeof playlistSchema>>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      name: "",
      image: "",
      songs: [],
      description: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof playlistSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("image", values.image);
    formData.append("picture", values.picture);
    formData.append("songs", songId);
    
    const savedSongResponse = await fetch(`${SERVER_URI}/api/users/${id}/playlists`, {
      method: "POST",
      body: formData,
      headers: {Authorization: `Bearer ${token}`}
    });


    const savedSong = await savedSongResponse.json();

    if(!savedSong.error){
      toast({
        title: "Uploaded",
        description: "Your song has been uploaded!",
      })
    }else{
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    }
  }
    
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="name" render={({field}) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Name" {...field}/>
            </FormControl>
            <FormDescription>
              This is the name of your playlist.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}/>

        <FormField control={form.control} name="description" render={({field}) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input type="" placeholder="Description" {...field}/>
            </FormControl>
            <FormDescription>
              This is the description of your playlist.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}/>

        <FormField control={form.control} name="picture" render={({field}) => (
          <FormItem>
            <FormLabel>Upload Cover Image</FormLabel>
            <FormControl>
              <FileUpload
                {...field}
                onChange={(files) => {
                  const file = files[0];
                  form.setValue("picture", file)
                  form.setValue("image", file.name)
                  field.onChange(file); 
                }}
              />
            </FormControl>
            <FormDescription>Upload the song cover here.</FormDescription>
            <FormMessage />
          </FormItem>
        )}/>
        
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
  )
}

export default PlaylistUpload;

