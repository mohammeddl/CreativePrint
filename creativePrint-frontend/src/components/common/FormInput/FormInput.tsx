interface FormInputProps {
    id: string;
    name: string;
    type: string;
    label: string;
    value: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export const FormInput = ({ 
    id, 
    name, 
    type, 
    label, 
    value, 
    required = false, 
    onChange 
  }: FormInputProps) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };