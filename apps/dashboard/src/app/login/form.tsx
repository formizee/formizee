'use client';

import {emailLogin, githubLogin, googleLogin} from './actions';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  toast,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@formizee/ui';
import {LoadingIcon} from '@formizee/ui/icons';
import {useForm} from 'react-hook-form';
import Link from 'next/link';
import {z} from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@formizee/ui/form';
import {useState} from 'react';

const formSchema = z.object({
  email: z.string().email({message: 'Invalid email address'})
});

export const LoginForm = ({
  redirectTo,
  selfHosting
}: {redirectTo: string; selfHosting: boolean}) => {
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const loginWithEmail = form.handleSubmit(async data => {
    try {
      setIsEmailLoading(true);
      await emailLogin(data);
    } catch (error) {
      const err = error as Error;
      toast({
        title: err.name,
        variant: 'destructive',
        description: err.message
      });
    }
  });

  const loginWithGithub = async () => {
    setIsGithubLoading(true);
    await githubLogin(redirectTo);
  };

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);
    await googleLogin(redirectTo);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4 w-full" onSubmit={loginWithEmail}>
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel className="text-neutral-400 dark:text-neutral-500">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  className="text-neutral-900 dark:text-neutral-50"
                  placeholder="you@mail.com"
                  required
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button
          disabled={isEmailLoading || isGithubLoading || isGoogleLoading}
          className="font-secondary border-2 hover:border-neutral-500 dark:hover:border-neutral-400 hover:bg-neutral-800 dark:hover:bg-neutral-300 border-neutral-700 dark:border-neutral-300 bg-neutral-900 dark:bg-neutral-100"
          type="submit"
        >
          {!isEmailLoading ? (
            <div className="flex flex-row items-center justify-center gap-2 w-full">
              Continue
            </div>
          ) : (
            <LoadingIcon className="size-8" />
          )}
        </Button>
        <div className="select-none flex flex-col gap-4">
          {selfHosting ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-default fixed w-full h-full bg-white dark:bg-black opacity-75 backdrop-blur-lg" />
                <TooltipContent side="top" sideOffset={-96} align="center">
                  Available on the Cloud Version
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div />
          )}
          <div className="flex flex-row items-center justify-between">
            <div className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-sm px-4 text-neutral-400 dark:text-neutral-700">
              OR
            </span>
            <div className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={loginWithGithub}
              className="w-full font-secondary border-2 text-neutral-950 dark:text-neutral-50"
              disabled={isEmailLoading || isGithubLoading || isGoogleLoading}
            >
              {!isGithubLoading ? (
                <div className="flex flex-row justify-center items-center gap-2 w-full">
                  <span>Login With Github</span>
                  <svg
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 256 250"
                  >
                    <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z" />
                  </svg>
                </div>
              ) : (
                <LoadingIcon className="size-8" />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={loginWithGoogle}
              className="w-full font-secondary border-2 text-neutral-950 dark:text-neutral-50"
              disabled={isEmailLoading || isGithubLoading || isGoogleLoading}
            >
              {!isGoogleLoading ? (
                <div className="flex flex-row justify-center items-center gap-2 w-full">
                  <span>Login With Google</span>
                  <svg
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 256 262"
                  >
                    <path d="M255.878 133.451C255.878 122.717 255.007 114.884 253.122 106.761H130.55V155.209H202.497C201.047 167.249 193.214 185.381 175.807 197.565L175.563 199.187L214.318 229.21L217.003 229.478C241.662 206.704 255.878 173.196 255.878 133.451Z" />
                    <path d="M130.55 261.1C165.798 261.1 195.389 249.495 217.003 229.478L175.807 197.565C164.783 205.253 149.987 210.62 130.55 210.62C96.0271 210.62 66.726 187.847 56.281 156.37L54.75 156.5L14.452 187.687L13.925 189.152C35.393 231.798 79.49 261.1 130.55 261.1Z" />
                    <path d="M56.281 156.37C53.525 148.247 51.93 139.543 51.93 130.55C51.93 121.556 53.525 112.853 56.136 104.73L56.063 103L15.26 71.312L13.925 71.947C5.077 89.644 0 109.517 0 130.55C0 151.583 5.077 171.455 13.925 189.152L56.281 156.37Z" />
                    <path d="M130.55 50.479C155.064 50.479 171.6 61.068 181.029 69.917L217.873 33.943C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947L56.1361 104.73C66.7261 73.253 96.0271 50.479 130.55 50.479Z" />
                  </svg>
                </div>
              ) : (
                <LoadingIcon className="size-8" />
              )}
            </Button>
          </div>
          <Button
            className="w-full font-secondary border-2 text-neutral-950 dark:text-neutral-50"
            variant="outline"
            type="button"
            asChild
          >
            <Link href="https://formizee.com">Go Back</Link>
          </Button>
          <p className="mt-2 text-balance text-center text-neutral-600 dark:text-neutral-400 text-xs">
            {'By signing in, you agree to our '}
            <Link
              className="underline underline-offset-2 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
              href="https://formizee.com/legal/terms-of-service"
            >
              Terms of Service
            </Link>
            {' and '}{' '}
            <Link
              className="underline underline-offset-2 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
              href="https://formizee.com/legal/privacy-policy"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </form>
    </Form>
  );
};
