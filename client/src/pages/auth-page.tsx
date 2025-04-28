import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth, LoginData, registerSchema, RegisterData } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema } from "@shared/schema";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Form side */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <Card className="w-[350px] sm:w-[400px]">
          <CardHeader>
            <CardTitle>Forest Service Assistant</CardTitle>
            <CardDescription>
              {authTab === "login"
                ? "Sign in to your account to continue"
                : "Create an account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={authTab} onValueChange={(value) => setAuthTab(value as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm isLoading={loginMutation.isPending} onSubmit={(data) => loginMutation.mutate(data)} />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm
                  isLoading={registerMutation.isPending}
                  onSubmit={(data) => registerMutation.mutate(data)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Hero side */}
      <div className="hidden md:flex md:w-1/2 bg-green-900 flex-col items-center justify-center p-8 text-white">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold">Explore America's Forests</h1>
          <p className="text-lg opacity-90">
            Discover the wealth of information about United States forests, conservation efforts,
            and educational resources with our interactive AI-powered assistant.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-green-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg">Forest Regions</h3>
              <p className="text-sm opacity-80">Explore diverse ecosystem regions across the US</p>
            </div>
            <div className="bg-green-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg">Conservation</h3>
              <p className="text-sm opacity-80">Learn about forest conservation and protection</p>
            </div>
            <div className="bg-green-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg">Education</h3>
              <p className="text-sm opacity-80">Access educational resources about forestry</p>
            </div>
            <div className="bg-green-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg">Recreation</h3>
              <p className="text-sm opacity-80">Find information about recreational activities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSubmit, isLoading }: { onSubmit: (data: LoginData) => void; isLoading: boolean }) {
  const loginSchema = insertUserSchema.pick({
    username: true,
    password: true,
  });

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Sign In
        </Button>
      </form>
    </Form>
  );
}

function RegisterForm({ onSubmit, isLoading }: { onSubmit: (data: RegisterData) => void; isLoading: boolean }) {
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Choose a username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Create Account
        </Button>
      </form>
    </Form>
  );
}