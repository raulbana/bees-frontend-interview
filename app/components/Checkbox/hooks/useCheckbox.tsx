interface UseCheckboxProps {
    onChange: (checked: boolean) => void;
}

export const useCheckbox = ({ onChange }: UseCheckboxProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return {
    handleChange,
  };
};
