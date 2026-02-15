import { Skeleton } from "@/components/ui/skeleton"

const UpdateStageSkeleton = () => {
    return (
        <div className="grid grid-cols-2 gap-40 p-4">
            <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div>
                <Skeleton className=" h-20     w-full" />
            </div>
        </div>

    )
}

export default UpdateStageSkeleton