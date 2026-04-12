import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import React from 'react'

export const InactiveNotfication = ({ classNames }: { classNames?: string }) => {
    return (
        <p className={cn("", classNames)}>اذا كان حسابك غير نشط او حساب تجريبي برجاء التواصل مع المدير المسوؤل</p>
    )
}




const DisplayInactiveNotfication = ({ classNames }: { classNames?: string }) => {
    const { profile } = useAuth()
    const [isOpen, setIsOpen] = React.useState(!profile?.is_active)
    return (
        <div className={cn('w-full fixed top-0 left-0 flex items-center justify-center gap-4 md:gap-60 py-2 px-4 font-bold bg-red-200 text-red-700 z-100', isOpen ? 'flex' : 'hidden', classNames)}>
            <InactiveNotfication />
            <X onClick={() => setIsOpen(false)} className='cursor-pointer' />
        </div>

    )
}

export default DisplayInactiveNotfication