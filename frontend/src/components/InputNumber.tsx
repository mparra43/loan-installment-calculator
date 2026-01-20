import { Controller, type Control, type RegisterOptions } from "react-hook-form";


interface Props {
  label: string
  name: string
  control: Control<any>;
  placeholder?: string;
  rules?: RegisterOptions;
}

export function InputNumber({ label, name, control, placeholder, rules, }: Props) {
  const combinedRules: RegisterOptions = { ...rules };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Controller
        name={name}
        control={control}
        rules={combinedRules}
        defaultValue=""
        render={({ field, fieldState }) => (
          <>
            <input
              id={name}
              type="number"
              step="any"
              {...field}
              value={field.value ?? ""}
              placeholder={placeholder}
              className={`w-full rounded-md border px-3 py-2 ${fieldState.error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {fieldState.error && (
              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  )
}