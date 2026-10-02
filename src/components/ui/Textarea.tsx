'use client';
import { forwardRef } from 'react';
export const Textarea = forwardRef<HTMLTextAreaElement, any>((props, ref) => <textarea ref={ref} className="border border-border bg-surface px-3 py-2 rounded-md w-full text-white" {...props} />);
Textarea.displayName = 'Textarea';