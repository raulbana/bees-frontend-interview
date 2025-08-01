import { useUserContext } from "@/app/store/userContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import loginFormSchema, { LoginFormValues } from "../schemas/loginFormSchema";

const useLoginForm = () => {
  const router = useRouter();
  const { login } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      isOver18: false,
    },
  });

  const fullName = watch("fullName");
  const isOver18 = watch("isOver18");

  const onSubmit = handleSubmit((data: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      const nameParts = data.fullName.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      login(firstName, lastName);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleNameChange = (value: string) => {
    setValue("fullName", value, { shouldValidate: true });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setValue("isOver18", checked, { shouldValidate: true });
  };

  const getNameErrors = () => {
    if (!errors.fullName) return [];
    return [{ hasError: true, message: errors.fullName.message || "" }];
  };

  return {
    fullName,
    isOver18,
    isValid,
    isSubmitting,
    nameErrors: getNameErrors(),
    onSubmit,
    handleNameChange,
    handleCheckboxChange,
    register,
  };
};

export default useLoginForm;
