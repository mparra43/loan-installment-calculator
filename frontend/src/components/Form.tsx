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
  onSubmit: (data: any) => Promise<void> | void
  defaultValues?: any
}

export function Form({ schema, fields, buttonProps, onSubmit, defaultValues }: FormProps) {
  const { control, handleSubmit, reset } = useForm<any>({ resolver: zodResolver(schema as any), defaultValues });

  const submitHandler: SubmitHandler<any> = async (data) => {
    try {
      await onSubmit(data);
      reset(); 
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="w-full grid grid-cols-3 gap-4">
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

      <div className="w-full col-span-3">
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