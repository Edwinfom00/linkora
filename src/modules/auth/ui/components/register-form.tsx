"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  Building2,
  UserCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "client",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {step === 1 && (
        <>
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="register-name" className="text-sm font-medium">
              Nom complet
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="register-name"
                type="text"
                placeholder="Jean Kamga"
                className="pl-10 h-12 rounded-xl border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-all"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-sm font-medium">
              Adresse email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="register-email"
                type="email"
                placeholder="votre@email.com"
                className="pl-10 h-12 rounded-xl border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-all"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-sm font-medium">
              Mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-12 rounded-xl border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-all"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="button"
            onClick={() => setStep(2)}
            className="w-full h-12 rounded-xl bg-indigo hover:bg-indigo/90 text-white font-semibold shadow-lg shadow-indigo/25 hover:shadow-indigo/40 transition-all gap-2"
          >
            Continuer
            <ArrowRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Je suis...
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("role", "client")}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300",
                  selectedRole === "client"
                    ? "border-indigo bg-indigo/5 shadow-lg shadow-indigo/10"
                    : "border-slate-200 dark:border-white/10 hover:border-indigo/30"
                )}
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                    selectedRole === "client"
                      ? "bg-indigo/10"
                      : "bg-slate-100 dark:bg-white/5"
                  )}
                >
                  <UserCircle
                    className={cn(
                      "w-7 h-7 transition-colors",
                      selectedRole === "client"
                        ? "text-indigo"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">Un client</p>
                  <p className="text-xs text-muted-foreground">
                    Je cherche des services
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue("role", "entreprise")}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300",
                  selectedRole === "entreprise"
                    ? "border-cyan bg-cyan/5 shadow-lg shadow-cyan/10"
                    : "border-slate-200 dark:border-white/10 hover:border-cyan/30"
                )}
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                    selectedRole === "entreprise"
                      ? "bg-cyan/10"
                      : "bg-slate-100 dark:bg-white/5"
                  )}
                >
                  <Building2
                    className={cn(
                      "w-7 h-7 transition-colors",
                      selectedRole === "entreprise"
                        ? "text-cyan"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">Une entreprise</p>
                  <p className="text-xs text-muted-foreground">
                    Je propose des services
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="h-12 rounded-xl border-slate-200 dark:border-white/10 px-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl bg-indigo hover:bg-indigo/90 text-white font-semibold shadow-lg shadow-indigo/25 hover:shadow-indigo/40 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Créer mon compte"
              )}
            </Button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-dark px-4 text-muted-foreground">
                ou continuer avec
              </span>
            </div>
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleRegister}
            className="w-full h-12 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 font-medium gap-3 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            Continuer avec Google
          </Button>
        </>
      )}
    </form>
  );
}
