import { X } from 'lucide-react'
import React from 'react'

const CustomToast = ({ text }: { text: string }) => {
    return (
        <div className='bg-white shadow rounded-md'>
            <X className='text-red-400 rounded-full w-10 h-10' />
            <p className='px-2 py-4 rounded-md'>{text}</p>
        </div>
    )
}

export default CustomToast