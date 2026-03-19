// src/pages/Login.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner'; // ← add this import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

type LoginFormData = {
  username: string;
  password: string;
};

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function Login({ setIsAuthenticated }: LoginProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormData) =>
      api.post('/auth/login', credentials),

   onSuccess: (response) => {
  const { token, username } = response.data;

  localStorage.setItem('token', token);
  localStorage.setItem('username', username);

  setIsAuthenticated(true);
  navigate('/', { replace: true });

  toast.success('Login successful', {
    description: `Welcome back, ${username}!`,
  });
},

    onError: (error: any) => {
      // Log full error for debugging
      console.error('Login failed:', error);

      // Extract useful message
      let errorMessage = 'Login failed. Please check your credentials.';

      if (error.response) {
        // Server responded with error (e.g. 401, 400)
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        console.error('Server response:', error.response.data);
      } else if (error.request) {
        // No response from server (network issue)
        errorMessage = 'No response from server. Check your network.';
        console.error('No response received:', error.request);
      } else {
        // Something else (setup error)
        errorMessage = error.message || 'An unexpected error occurred.';
        console.error('Request setup error:', error.message);
      }

      // Show toast
      toast.error('Login Failed', {
        description: errorMessage,
        duration: 5000,
      });

      // Also show in form (optional)
      setError('root', { message: errorMessage });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold mb-4">
            OV
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Ocean View Resort</h1>
          <p className="text-muted-foreground mt-2">Management Dashboard</p>
        </div>

        <Card className="border shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  autoComplete="username"
                  {...register('username', {
                    required: 'Username is required',
                  })}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Server/global error (shown below button) */}
              {errors.root && (
                <p className="text-sm text-destructive text-center font-medium">
                  {errors.root.message}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}