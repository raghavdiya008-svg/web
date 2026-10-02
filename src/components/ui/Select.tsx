'use client';
import { forwardRef } from 'react';
export const Select = forwardRef<HTMLSelectElement, any>((props, ref) => <select ref={ref} className="border border-border bg-surface px-3 py-2 rounded-md w-full text-white" {...props} />);
Select.displayName = 'Select';