"use client";
import Button from "@/app/components/Button/Button";
import Checkbox from "@/app/components/Checkbox/Checkbox";
import Input from "@/app/components/Input/Input";
import React from "react";
import useLoginForm from "./hooks/useLoginForm";

const LoginForm = () => {
  const {
    fullName,
    isOver18,
    isValid,
    isSubmitting,
    nameErrors,
    onSubmit,
    handleNameChange,
    handleCheckboxChange,
  } = useLoginForm();

  return (
    <div className="flex flex-col gap-4 justify-center max-w-md p-6">
      <p>Please, enter your full name below</p>
      <p>Only alphabetical characters are accepted</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" role="form">
        <Input
          placeholder="Your full name"
          value={fullName}
          onChange={(e) => handleNameChange(e.target.value)}
          error={nameErrors}
        />

        <div className="flex flex-col items-center gap-4">
          <Checkbox
            checked={isOver18}
            onChange={handleCheckboxChange}
            label="Are you older than 18 years old?"
          />

          <div className="flex w-20">
            <Button
              text="Enter"
              typeButton="submit"
              type={isValid ? "PRIMARY" : "DISABLED"}
              disabled={!isValid || isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
