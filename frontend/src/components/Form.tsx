import type { ZodSchema } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { RegisterOptions, SubmitHandler } from 'react-hook-form'

import { InputNumber } from './InputNumber'
import { Button } from './Button'

export type FieldConfig = {
  label: string
  name: string
  placeholder?: string
  type?: 'text' | 'number'
  rules?: RegisterOptions
  inputType: 'text' | 'date'
}

export interface FormProps {
  schema: ZodSchema<any>
  fields: FieldConfig[]
  buttonProps: {
    label: string
    type?: 'submit' | 'button'
    variant?: 'primary' | 'secondary'
    floating?: boolean
    disabled?: boolean
  }
  onSubmit: (data: any) => void
  defaultValues?: any
}

export function Form({ schema, fields, buttonProps, onSubmit, defaultValues }: FormProps) {
  const { control, handleSubmit } = useForm<any>({ resolver: zodResolver(schema as any), defaultValues });

  const submitHandler: SubmitHandler<any> = (data) => onSubmit(data);

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4 w-full">
      {fields.map((f) => {
        
          return (
            <InputNumber
              key={f.name}
              label={f.label}
              name={f.name}
              control={control}
              placeholder={f.placeholder}
              rules={f.rules}
            />
          );
      })}

      <div className="w-full">
        <Button
          label={buttonProps.label}
          type={buttonProps.type === "submit" ? "submit" : "button"}
          variant={buttonProps.variant}
          disabled={buttonProps.disabled}
        />
      </div>
    </form>
  );
}