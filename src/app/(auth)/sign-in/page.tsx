"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { Loader2, Lock, User } from "lucide-react";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignInForm = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
          redirect: false, // corrected typo here
          identifier: data.identifier,
          password: data.password,
        });
      
        if (!result) {
          toast({
            title: 'Unexpected Error',
            description: 'No response received from sign in',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
      
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Invalid credentials',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        } else if (result.error) {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
      
        if (result.url) {
          setIsSubmitting(false);
          router.replace('/dashboard');
        } else {
          setIsSubmitting(false);
        }
      };
      

return (
    <div className="max-w-md w-full mx-auto mt-4 rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black ">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Welcome Back to True Feedback
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Login to start your anonymous adventure. We promise not to tell anyone who you are.
        </p>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="my-8">
                <div className="space-y-4 my-4">
                    <FormField
                        name="identifier"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <LabelInputContainer>
                                    <FormLabel className="flex gap-2 items-center"><User/>Email/Username</FormLabel>
                                    <Input  {...field} placeholder="john@gmail.com"/>
                                </LabelInputContainer>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <LabelInputContainer>
                                    <FormLabel className="flex gap-2 items-center"><Lock/>Password</FormLabel>
                                    <Input {...field} type="password" placeholder="••••••••" />
                                </LabelInputContainer>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>

                <Button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Login →"
                    )}
                    <BottomGradient />
                </Button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                <div className="text-center mt-4">
                    <p className="text-neutral-600 dark:text-neutral-300">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </form>
        </Form>
    </div>
);
};

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

export default SignInForm;