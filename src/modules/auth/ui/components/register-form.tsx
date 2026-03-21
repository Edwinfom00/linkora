"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Building2,
  UserCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { signUp, signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "client",
    },
    mode: "onTouched"
  });

  const selectedRole = watch("role");

  const handleNextStep = async () => {
    const isStep1Valid = await trigger(["name", "email", "password"]);
    if (isStep1Valid) {
      setStep(2);
    }
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Cast the payload to any to bypass the custom 'role' field issue with better-auth TS types
      const payload: any = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };
      const result = await signUp.email(payload);

      if (result.error) {
        toast.error(result.error.message || "Erreur lors de l'inscription");
        return;
      }

      toast.success("Compte créé avec succès !");
      router.push(data.role === "entreprise" ? "/dashboard" : "/");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 && (
          <>
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-sm font-medium text-gray-900">
                Nom complet
              </label>
              <input
                id="register-name"
                type="text"
                placeholder="Jean Kamga"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-sm font-medium text-gray-900">
                Adresse email
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="votre@email.com"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-sm font-medium text-gray-900">
                Mot de passe
              </label>
              <input
                id="register-password"
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full flex justify-center items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors mt-2"
            >
              Continuer
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Je suis...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Client Role */}
                <button
                  type="button"
                  onClick={() => setValue("role", "client")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-md border text-center transition-colors focus:outline-none",
                    selectedRole === "client"
                      ? "bg-blue-50 border-blue-600 shadow-sm"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-md flex items-center justify-center",
                    selectedRole === "client" ? "bg-white border border-blue-100" : "bg-gray-100 border border-gray-200"
                  )}>
                    <UserCircle className={cn("w-5 h-5", selectedRole === "client" ? "text-blue-600" : "text-gray-500")} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Un client</p>
                    <p className="text-xs text-gray-500 mt-0.5">Je cherche des services</p>
                  </div>
                </button>

                {/* Entreprise Role */}
                <button
                  type="button"
                  onClick={() => setValue("role", "entreprise")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-md border text-center transition-colors focus:outline-none",
                    selectedRole === "entreprise"
                      ? "bg-blue-50 border-blue-600 shadow-sm"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-md flex items-center justify-center",
                    selectedRole === "entreprise" ? "bg-white border border-blue-100" : "bg-gray-100 border border-gray-200"
                  )}>
                    <Building2 className={cn("w-5 h-5", selectedRole === "entreprise" ? "text-blue-600" : "text-gray-500")} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Une entreprise</p>
                    <p className="text-xs text-gray-500 mt-0.5">Je propose des services</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center justify-center w-10 h-9 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                aria-label="Retour"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center items-center h-9 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </div>
          </>
        )}
      </form>

      {step === 1 && (
        <>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-400">
                ou continuer avec
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
        </>
      )}
    </div>
  );
}
