'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bold, Italic, Link2, List, ListOrdered, Undo2 } from 'lucide-react';
import * as React from 'react';
// import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  description: z
    .string()
    .min(10, {
      message: 'Job description must be at least 10 characters.',
    })
    .max(500, {
      message: 'Job description cannot exceed 500 characters.',
    }),
});

interface CustomTextAreaProps {
  label?: string;
  maxLength?: number;
  placeholder?: string;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
}

export default function CustomMDTextArea({
  label = 'Job Descriptions',
  maxLength = 500,
  placeholder = 'Enter job description',
}: // onSubmit = (data) => console.log(data),
CustomTextAreaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [serverError, setServerError] = React.useState<string | undefined>(
    undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  const handleFormat = (format: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.getValues('description');

    let newText = text;
    let newCursorPos = end;

    switch (format) {
      case 'bold':
        newText =
          text.slice(0, start) +
          `**${text.slice(start, end)}**` +
          text.slice(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newText =
          text.slice(0, start) +
          `_${text.slice(start, end)}_` +
          text.slice(end);
        newCursorPos = end + 2;
        break;
      case 'bullet':
        newText =
          text.slice(0, start) +
          `\n• ${text.slice(start, end)}` +
          text.slice(end);
        newCursorPos = end + 3;
        break;
      case 'number':
        // eslint-disable-next-line no-case-declarations
        const lines = text.slice(0, start).split('\n');
        // eslint-disable-next-line no-case-declarations
        const lineNumber = lines.length;
        newText =
          text.slice(0, start) +
          `\n${lineNumber}. ${text.slice(start, end)}` +
          text.slice(end);
        newCursorPos = end + lineNumber.toString().length + 3;

        break;
      case 'link':
        newText =
          text.slice(0, start) +
          `[${text.slice(start, end)}](url)` +
          text.slice(end);
        newCursorPos = end + 6;
        break;
    }

    form.setValue('description', newText, { shouldValidate: true });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleUndo = () => {
    const currentText = form.getValues('description');
    if (currentText.length > 0) {
      form.setValue('description', currentText.slice(0, -1), {
        shouldValidate: true,
      });
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setServerError(undefined);
    const formData = new FormData();
    formData.append('description', data.description);

    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {/* {JSON.stringify(data, null, 2)} */}
            {`description: ${data.description}`}
          </code>
        </pre>
      ),
    });
  }

  return (
    <div className={'w-full'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Textarea
                      {...field}
                      ref={(e) => {
                        textareaRef.current = e;
                        if (field.ref) {
                          if (typeof field.ref === 'function') {
                            field.ref(e);
                          } else {
                            if (field.ref && typeof field.ref !== 'function') {
                              (
                                field.ref as React.MutableRefObject<HTMLTextAreaElement | null>
                              ).current = e;
                            }
                          }
                        }
                      }}
                      placeholder={placeholder}
                      className='resize-y'
                      maxLength={maxLength}
                      rows={12}
                    />
                    <div className='absolute bottom-0 left-0 right-0 border-t bg-white p-2 flex items-center gap-0.5'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-foreground'
                        onClick={handleUndo}>
                        <Undo2 className='h-4 w-4' />
                        <span className='sr-only'>Undo</span>
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-foreground'
                        onClick={() => handleFormat('bold')}>
                        <Bold className='h-4 w-4' />
                        <span className='sr-only'>Bold</span>
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-foreground'
                        onClick={() => handleFormat('italic')}>
                        <Italic className='h-4 w-4' />
                        <span className='sr-only'>Italic</span>
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-foreground'
                        onClick={() => handleFormat('bullet')}>
                        <List className='h-4 w-4' />
                        <span className='sr-only'>Bullet List</span>
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-foreground'
                        onClick={() => handleFormat('number')}>
                        <ListOrdered className='h-4 w-4' />
                        <span className='sr-only'>Numbered List</span>
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-foreground'
                        onClick={() => handleFormat('link')}>
                        <Link2 className='h-4 w-4' />
                        <span className='sr-only'>Add Link</span>
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className='flex justify-between text-sm'>
                  <span>Maximum {maxLength} characters</span>
                  <span>
                    {field.value.length}/{maxLength}
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {serverError && <p className='text-red-500'>{serverError}</p>}
          <Button type='submit' className='mt-4'>
            Submit
          </Button>
          {/* <SubmitButton /> */}
        </form>
      </Form>
    </div>
  );
}

// function SubmitButton() {
//   const { pending } = useFormStatus();

//   return (
//     <Button type='submit' className='mt-4' disabled={pending}>
//       {pending ? 'Submitting...' : 'Submit'}
//     </Button>
//   );
// }
