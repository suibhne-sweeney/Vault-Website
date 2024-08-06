import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { Step, Stepper, useStepper } from "@/components/stepper";
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
import { toast } from "@/components/ui/use-toast";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { setLogin } from "@/state";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "/assets/logo.png";
import { Separator } from "@/components/ui/separator";

const steps = [
	{ label: "Step 1", description: "Get Started" },
	{ label: "Step 2", description: "Secure your Account" },
    { label: "Step 3", description: "Tell us About yourself" },
];

const loginSchema = z.object({
    email: z.string()
      .email({ message: "Invalid email address." 
    }),
    password: z.string()
        .min(8, {message: "Password must be at least 8 characters.",
	}),
});

export default function AuthenticateForm() {
    const [pageType, setPageType] = useState("register");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const login = async (values: unknown) => {
        console.log(values)
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

    async function onSubmit(values: z.infer<typeof loginSchema>) {
       if(isLogin) await login(values);
    }

	return (
        <>
            {isRegister && (
                <Stepper variant="circle-alt" initialStep={0} steps={steps}>
                    {steps.map((stepProps, index) => {
                        if (index === 0) {
                            return (
                                <Step key={stepProps.label} {...stepProps}>
                                    <FirstStepForm />
                                </Step>
                            );
                        }
                        if (index === 1) {
                            return (
                                <Step key={stepProps.label} {...stepProps}>
                                    <SecondStepForm />
                                </Step>
                            );
                        }
                        if(index === 2) {
                            return (
                                <Step key={stepProps.label} {...stepProps}>
                                    <ThirdStepForm />
                                </Step>
                            )
                        }
                    })}
                </Stepper>
            )}
            
            {isLogin && (
                  <div className="flex items-center justify-center min-h-screen">
                    <Card className="w-full h-full max-w-xl mx-auto p-8 opacity-85">
                        <CardHeader>
                        <div className="flex justify-center items-center" >
                            <img src={logo} alt="logo" className="h-40 w-40"/>
                        </div>
                        <CardTitle className="text-center">Log in to Vault</CardTitle>
                        <CardDescription className="text-center">We've missed you! Log in to see what’s new.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input type="email" placeholder="Email" {...field} /></FormControl>
                                            <FormDescription>Enter your email here.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl><Input type="password" placeholder="Password" {...field} /></FormControl>
                                            <FormDescription>Enter your password here.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <Button type="submit">Log in</Button>
                            </form>
                            </Form>
                        </CardContent>
                        <Separator className=" m-3"/>
                        <CardFooter className="flex justify-between text-center">Don't have an account? sign up here</CardFooter>
                  </Card>
                </div>
            )}
        </>
	);
}

const FirstFormSchema = z.object({
    email: z.string()
      .email({ message: "Invalid email address." }),
});

function FirstStepForm() {
	const { nextStep } = useStepper();

	const form = useForm<z.infer<typeof FirstFormSchema>>({
		resolver: zodResolver(FirstFormSchema),
		defaultValues: {
			email: "",
		},
	});

	function onSubmit(values: z.infer<typeof FirstFormSchema>) {
        console.log(values)
        toast({
			title: "First step submitted!",
		});
		nextStep();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="email" {...field} />
							</FormControl>
							<FormDescription>
								Enter your Email.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<StepperFormActions />
			</form>
		</Form>
	);
}

const SecondFormSchema = z.object({
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
});

function SecondStepForm() {
	const { nextStep } = useStepper();

	const form = useForm<z.infer<typeof SecondFormSchema>>({
		resolver: zodResolver(SecondFormSchema),
		defaultValues: {
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof SecondFormSchema>) {
        console.log(values)
        toast({
			title: "Second step submitted!",
		});
		nextStep();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="password" {...field} />
							</FormControl>
							<FormDescription>This is your private password.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<StepperFormActions />
			</form>
		</Form>
	);
}

const ThirdFormSchema = z.object({
    username: z.string()
      .min(2, { message: "Username must be at least 2 characters long." })
      .max(30, { message: "Username must be less than 30 characters long." }),
    dateOfBirth: z.string(),
    gender: z.enum(["Male", "Female", "None"], {
        message: "Gender must be one of the following: Male, Female, None."
    }),
    picture: z.string()
      .url({ message: "Picture must be a valid URL." })
      .optional(), // marking this as optional if it's not required
});

function ThirdStepForm(){
    const { nextStep } = useStepper();

    const form = useForm<z.infer<typeof ThirdFormSchema>>({
        resolver: zodResolver(ThirdFormSchema),
        defaultValues: {
            username: "",
            dateOfBirth: "",
            gender: "None",
            picture: ""
        }
    })

    function onSubmit(values: z.infer<typeof SecondFormSchema>) {
        console.log(values)
        toast({
			title: "Second step submitted!",
		});
		nextStep();
	}

    return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input type="text" placeholder="name" {...field} />
							</FormControl>
							<FormDescription>This name will appear on your profile.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
                <FormField
					control={form.control}
					name="dateOfBirth"
					render={({ field }) => (
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
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
                        <FormMessage />
                      </FormItem>
					)}
				/>
				<StepperFormActions />
			</form>
		</Form>
    )
}


function StepperFormActions() {
	const {
		prevStep,
		resetSteps,
		isDisabledStep,
		hasCompletedAllSteps,
		isLastStep,
	} = useStepper();

	return (
		<div className="w-full flex justify-end gap-2">
			{hasCompletedAllSteps ? (
				<Button size="sm" type="button" onClick={resetSteps}>
					Reset
				</Button>
			) : (
				<>
					<Button
						disabled={isDisabledStep}
						onClick={prevStep}
						size="sm"
						variant="secondary"
						type="button"
					>
						Prev
					</Button>
					<Button size="sm" type="submit">
						{isLastStep ? "Finish" : "Next"}
					</Button>
				</>
			)}
		</div>
	);
}


