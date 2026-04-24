import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../ui/pagination'
import { Button } from '../ui/button';

interface Props {
    goToPage: (page: number) => void,
    page: number,
    limit: number,
    length: number
}
const ProjectsPagination = ({ goToPage, page, length }: Props) => {

    return (
        <Pagination dir="ltr">
            <PaginationContent className='ms-auto'>

                <PaginationItem>

                    <Button
                        className=' cursor-pointer px-6'
                        size='sm'
                        disabled={page == 1}
                        variant='outline'
                        onClick={() => goToPage(Math.max(page - 1, 1))}
                    >
                        السابق

                    </Button>
                </PaginationItem>

                {/* {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={page === i + 1}
                            onClick={() => goToPage(i + 1)}
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))} */}

                <PaginationItem>
                    <Button
                        className=' cursor-pointer px-6'
                        size='sm'
                        disabled={!length}
                        variant='outline'
                        onClick={() => goToPage(page + 1)}
                    >
                        التالي

                    </Button>

                </PaginationItem>

            </PaginationContent>
        </Pagination>
    );
};

export default ProjectsPagination