
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signupUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  UserRow,
  getAuthUser,
  getUserByUserId,
 } from "../api/user";
import { toast } from "sonner";

export const userQueries = {
  all: () => ["users"] as const,
  byId: (id: string) => [...userQueries.all(), "user", id] as const,
};

// Hooks

// Fetch all users
export const useGetUsers = () => {
  return useQuery({
    queryKey: userQueries.all(),
    queryFn: getUsers,
  });
};

// Fetch single user by id
export const useGetUserById = () => {
  return useQuery({
    queryKey: userQueries.byId(Math.random().toString()),
    queryFn: getUserById,
  });
};

// Signup user
export const useSignupUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:signupUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueries.all() });
    },
  });
};

 export const useGetUserByUserId = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:getUserByUserId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueries.all() });
    },
  });
};


// Login user
export const useLoginUser = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginUser(email, password),
    onSuccess: () => {
        toast.success('Successfully signed in')
    },
    onError: (error: any) => {
       if (error?.message?.includes('Email not confirmed')) {
        toast.error('Please check your email and confirm your account before signing in')
      } else {
        toast.error('Failed to sign in. please check console for more .')
      }
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<UserRow> }) => updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueries.all() });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueries.all() });
    },
  });
};


export const useGetAuthUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: () => getAuthUser(),
  });
};