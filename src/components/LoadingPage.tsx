import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingPage = () => {
    return (
        <div className="min-h-screen flex items-center gap-4 justify-center flex-col">
            <div className="animate-pulse text-2xl text-muted-foreground">جاري التحميل</div>
            <Loader2 className="w-12 h-12 animate-spin" />
        </div>
    )
}

export default LoadingPage