import React from 'react'
import { Skeleton } from './ui/skeleton'
import { TableCell, TableRow } from './ui/table'

const LoadingRowSkeleton = () => {
    return (
        <TableRow >

            <TableCell >
                <SkeletonComponents />
            </TableCell>
            <TableCell >
                <SkeletonComponents />
            </TableCell>
            <TableCell >
                <SkeletonComponents />
            </TableCell>
            <TableCell >
                <SkeletonComponents />
            </TableCell>


        </TableRow>
    )
}

export default LoadingRowSkeleton

const SkeletonComponents = () => {
    return (
        <Skeleton className='h-16  w-full flex-wrap flex gap-4' />

    )
}