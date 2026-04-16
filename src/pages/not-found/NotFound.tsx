import { ROUTE_PATHS } from '@/lib'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
            <div className="relative">
                <h1 className="text-9xl font-black text-muted/20 select-none">404</h1>
                <p className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
                    الصفحة غير موجودة
                </p>
            </div>
            <p className="text-muted-foreground max-w-md px-4">
                عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله لمكان آخر.
            </p>
            <Link
                to={ROUTE_PATHS.DASHBOARD}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                العودة للرئيسية
            </Link>
        </div>
    )
}

export default NotFound