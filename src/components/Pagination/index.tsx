import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export default function PaginationComponent({currentPage, lastPage, onPageChange}: PaginationProps) {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#"
                                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}/>
                </PaginationItem>
                {currentPage > 2 && (
                    <PaginationItem>
                        <PaginationLink href="#" onClick={() => onPageChange(1)}>1</PaginationLink>
                    </PaginationItem>
                )}
                {currentPage > 2 && (
                    <PaginationItem>
                        <PaginationEllipsis/>
                    </PaginationItem>
                )}
                <PaginationItem>
                    <PaginationLink href="#" isActive>{currentPage}</PaginationLink>
                </PaginationItem>
                {currentPage < lastPage - 1 && (
                    <PaginationItem>
                        <PaginationEllipsis/>
                    </PaginationItem>
                )}
                {currentPage < lastPage - 1 && (
                    <PaginationItem>
                        <PaginationLink href="#"
                                        onClick={() => onPageChange(lastPage)}>{lastPage}</PaginationLink>
                    </PaginationItem>
                )}
                <PaginationItem>
                    <PaginationNext href="#"
                                    onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
