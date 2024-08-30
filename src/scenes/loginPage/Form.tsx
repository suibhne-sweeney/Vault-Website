import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { setLogin } from "@/state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import imageLogin from "/assets/loginImage.png";
import imageSignup from "../../../public/assets/signupLogin.jpg"
import HyperText from "@/components/magicui/hyper-text";
import { FileUpload } from "@/components/aceternityui/file-upload";

const registerSchema = z.object({
  email: z.string()
    .email({ message: "Invalid email address." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." }),
  firstName: z.string()
    .min(2, { message: "First name must be at least 2 characters long." })
    .max(30, { message: "First name must be less than 30 characters long." }),
  lastName: z.string()
    .min(2, { message: "Last name must be at least 2 characters long." })
    .max(30, { message: "Last name must be less than 30 characters long." }),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["Male", "Female", "None"], {
    message: "Gender must be one of the following: Male, Female, None."
  }),
  picture: z.string()
});

// Define schema for login
const loginSchema = registerSchema.pick({
  email: true,
  password: true,
});

export default function AuthenticateForm() {
    const [pageType, setPageType] = useState("login");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const schema = isLogin ? loginSchema : registerSchema;
    const [step, setStep] = useState(0)

    const [files, setFiles] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
      setFiles(files);
      console.log(files);
    };
  
    const form = useForm<z.infer<typeof registerSchema>>({
      resolver: zodResolver(isLogin ? loginSchema : registerSchema),
      defaultValues: {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        dateOfBirth: new Date(),
        gender: "None",
        picture: "",
      },
    });

    const login = async (values: z.infer<typeof schema>) => {
      const loggedInResponse = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const loggedIn = await loggedInResponse.json();
      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/home");
      }
    };

    const signup = async (values: z.infer<typeof schema>) => {
      const formData = new FormData();
      for(const value in values){
        formData.append(value, values[value])
      }
      formData.append("picture", files[0]);
      formData.append("picturePath", files[0].name);

      const savedUserResponse = await fetch("http://localhost:3001/api/auth/regiseter",{
        method: "POST",
        body: formData,
      });
      const savedUser = await savedUserResponse.json();
      if(savedUser){
        setPageType("login");
      }
    }

    async function onSubmit(values: z.infer<typeof schema>) {
       if(isLogin) await login(values);
       else await signup(values)
    }

	return (
    <>
      {isRegister && (
        <div className="w-full h-full lg:grid lg:min-h-[901px] lg:grid-cols-2 xl:min-h-[936px]">
          <div className=" relative hidden bg-muted lg:block">
            <img
              src={imageSignup}
              alt="Image"
              width="1920"
              height="1080"
              className="h-full w-full object-cover dark:brightness-[0.4] grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <HyperText
                className=" text-6xl font-bold text-white"
                text="Vault"
              />
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Sign-up</h1>
                <p className="text-balance text-muted-foreground">
                  Let's create to your account!
                </p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {step === 0 && 
                    <>
                      <FormField control={form.control} name="email" render={({field}) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                          <FormDescription>Enter your email here.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <br />
                      <Button className="w-full" onClick={() => {
                        form.trigger("email").then((isValid) => {
                          isValid && setStep(1)  
                        }); 
                      }}>Next</Button>
                    </>
                  }
                  {step === 1 && 
                    <>
                      <div className="flex items-center">
                        <Button onClick={() => setStep(0)} variant={"ghost"}><ChevronLeft/></Button>
                        <span>2 of 3</span>
                      </div>
                      <FormField control={form.control} name="password" render={({field}) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl><Input type="password" placeholder="password123" {...field} /></FormControl>
                          <FormDescription>Enter your password here.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <br />
                      <Button className="w-full" onClick={() => {
                        form.trigger("password").then((isValid) => {
                          isValid && setStep(2)
                        }); 
                      }}>Next</Button>
                    </>
                  }
                  {step === 2 && 
                    <>
                      <div className="flex items-center">
                        <Button onClick={() => setStep(1)} variant={"ghost"}><ChevronLeft/></Button>
                        <span>3 of 3</span>
                      </div>
                      <div className="flex space-x-10">
                        <FormField control={form.control} name="firstName" render={({field}) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl><Input type="text" placeholder="John" {...field} /></FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="lastName" render={({field}) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl><Input type="text" placeholder="Doe" {...field} /></FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}/>
                      </div>
                      <br />
                      <div className="flex space-x-10">
                        <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  captionLayout="dropdown-buttons"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  fromYear={1960}
                                  toYear={2030}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="gender" render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="None" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                      <br />
                      <FormField control={form.control} name="picture" render={({field}) => (
                        <FormItem>
                          <FormLabel>Upload</FormLabel>
                          <FormControl><FileUpload {...field} onChange={handleFileUpload} /></FormControl>
                          <FormDescription>Upload your picture here.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <br />
                      <Button type="submit" className="w-full">
                        Sign-up
                      </Button>
                    </>
                  }
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a onClick={() => setPageType("login")} className="underline cursor-pointer">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLogin && (
        <div className="w-full h-full lg:grid lg:min-h-[901px] lg:grid-cols-2 xl:min-h-[936px]">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField control={form.control} name="email" render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                      <FormDescription>Enter your email here.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <br />
                  <FormField control={form.control} name="password" render={({field}) => (
                    <FormItem>
                      <FormLabel>Password <a className=" float-right ml-auto inline-block text-sm underline" href="#">Forgot your password?</a></FormLabel>
                      <FormControl><Input type="password" placeholder="password123" {...field} /></FormControl>
                      <FormDescription>Enter your password here.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <br />
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <a onClick={() => setPageType("register")} className="underline cursor-pointer">
                  Sign up
                </a>
              </div>
            </div>
          </div>
          <div className=" relative hidden bg-muted lg:block">
            <img
              src={imageLogin}
              alt="Image"
              width="1920"
              height="1080"
              className="h-full w-full object-cover dark:brightness-[0.4] grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <HyperText
                className=" text-6xl font-bold text-white"
                text="Vault"
              />
            </div>
          </div>
        </div>
      )}
    </>
	);
}