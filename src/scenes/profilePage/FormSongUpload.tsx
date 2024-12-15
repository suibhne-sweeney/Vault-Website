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
import { useState } from "react";
import { FileUpload } from "@/components/aceternityui/file-upload";
import { Check, ChevronsUpDown } from 'lucide-react';
import { PopoverTrigger, Popover, PopoverContent} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useToast } from "@/hooks/use-toast";

const songSchema = z.object({
  name: z.string()
    .min(2, { message: "Song name must be at least 2 characters long." })
    .max(30, { message: "Song name must be less than 30 characters long." }),
  image: z.string(),
  song: z.string(),
  date: z.coerce.date(),
  genres: z.array(z.string())
    .min(1, { message: "Song should have at least 1 genre." })
    .max(5, {message: "Song can not have more than 5 genres."}),
  picture: z.instanceof(File, { message: "Cover image is required." })
    .refine((file) => file.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported."
    ),
  sound: z.instanceof(File, {message: "Song file is required."})
    .refine((file) => file.size <= 30000000, "Max file size is 30MB")
    .refine(
      (file) => ["audio/mpeg", "audio/wav", "audio/ogg"].includes(file.type),
      "Only .mp3, .wav, and .ogg formats are supported."
    )
  }) 



const SongForm = (props: {id: string, token: string}) => {
  const { id, token } = props;
  const { toast } = useToast()

  const [step, setStep] = useState(0);

  const musicGenres = [
    { value: "rock", label: "Rock" },
    { value: "pop", label: "Pop" },
    { value: "jazz", label: "Jazz" },
    { value: "hip-hop", label: "Hip-Hop" },
    { value: "classical", label: "Classical" },
    { value: "electronic", label: "Electronic" },
    { value: "country", label: "Country" },
    { value: "blues", label: "Blues" },
    { value: "reggae", label: "Reggae" },
    { value: "metal", label: "Metal" },
    { value: "folk", label: "Folk" },
    { value: "rnb", label: "R&B" },
    { value: "soul", label: "Soul" },
    { value: "punk", label: "Punk" },
    { value: "indie", label: "Indie" },
    { value: "funk", label: "Funk" },
    { value: "latin", label: "Latin" },
    { value: "disco", label: "Disco" },
    { value: "gospel", label: "Gospel" },
    { value: "kpop", label: "K-pop" }
  ];
  
  const form = useForm<z.infer<typeof songSchema>>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      name: "",
      image: "",
      song: "",
      date: new Date(),
      genres: []
    },
  })

  const onSubmit = async (values: z.infer<typeof songSchema>) => {
    const formData = new FormData();
    for(const value in values){
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      formData.append(value, values[value]) 
    }
    const savedSongResponse = await fetch(`http://localhost:3001/api/users/${id}/songs`, {
      method: "POST",
      body: formData,
      headers: {Authorization: `Bearer ${token}`}
    });
    const savedSong = await savedSongResponse.json();

    if(savedSong){
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
      {step === 0 && (
        <>
          <FormField control={form.control} name="name" render={({field}) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field}/>
              </FormControl>
              <FormDescription>
                This is the name of your song.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}/>
          <FormField control={form.control} name="genres" render={({field}) => (
            <FormItem  className="flex flex-col z-50">
              <FormLabel>Genres</FormLabel>
              <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {field.value.length > 0
                      ? field.value.map((genre, index) => (
                        index === 0 
                          ? `${genre.charAt(0).toUpperCase() + genre.slice(1)}` 
                          : `, ${genre.charAt(0).toUpperCase() + genre.slice(1)}`
                      )) : "Select genres..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput className="" placeholder="Search Genres..." />
                    <CommandList className="custom-scrollbar">
                      <CommandEmpty>No Genre found.</CommandEmpty>
                      <CommandGroup>
                        {musicGenres.map((genre) => (
                          <CommandItem
                            key={genre.value}
                            value={genre.label}
                            onSelect={() => {
                              field.value.includes(genre.value)
                                ? (
                                  field.value.splice(field.value.indexOf(genre.value), 1),
                                  form.setValue("genres", field.value)
                                ) : form.setValue("genres", [...field.value, genre.value])
                            }}
                          >
                            {genre.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                field.value.includes(genre.value) ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              </FormControl>
              <FormDescription>
                Tell us what genres your song fits.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}/>
          <Button className="w-full" onClick={() => {
            form.trigger(["name", "genres"]).then((isValid) => {
              isValid && setStep(1)  
            }); 
          }}>Next</Button>
        </>
      )}
      {step === 1 && (
        <>
          <Button onClick={() => setStep(0)} variant={"outline"}> <span>Go Back</span></Button>
          <FormField control={form.control} name="date" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Release</FormLabel>
              <FormControl className="flex justify-center">
                <Calendar
                  className="rounded-md border"
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={field.value}
                  onSelect={field.onChange}
                  fromYear={1960}
                  toYear={2030}
                  initialFocus
                  {...field}
                />
              </FormControl>
              <FormDescription>This is the date your song was released.</FormDescription>
              <FormMessage />
            </FormItem>
          )}/>
          <Button className="w-full" onClick={() => {
            form.trigger("date").then((isValid) => {
              isValid && setStep(2)  
            }); 
          }}>Next</Button>
        
        </>
      )}
      {step === 2 && (
        <>
          <Button onClick={() => setStep(1)} variant={"outline"}> <span>Go Back</span></Button>
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
          <Button
            className="w-full"
            onClick={() => {
              form.trigger("picture").then((isValid) => {
                if (isValid) {
                  setStep(3);
                }
              });
            }}
          >
            Next
          </Button>
        </>
      )}
      {step === 3 && (
        <>
          <Button onClick={() => setStep(2)} variant={"outline"}> <span>Go Back</span></Button>
          <FormField control={form.control} name="sound" render={({field}) => (
            <FormItem>
              <FormLabel>Upload Song</FormLabel>
              <FormControl>
                <FileUpload
                  {...field}
                  onChange={(files) => {
                    const file = files[0];
                    form.setValue("sound", file)
                    form.setValue("song", file.name)
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormDescription>Upload the song here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}/>
          <Button type="submit" className="w-full">Submit</Button>
        </>
      )}
      </form>
    </Form>
  )
}

export default SongForm;

