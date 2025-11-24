import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ReactPaginate from "react-paginate";
import { useModsContext } from "../../context/context";
import './pagination.css';

function Pagination() {

    const { currentPage, lastPage, setCurrentPage } = useModsContext();


    return (
        <ReactPaginate 
            className="pages"
            activeClassName="active"
            breakLabel="..."
            
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            forcePage={currentPage}
            previousLabel={<ChevronLeft />}
            nextLabel={<ChevronRight />}
            pageCount={lastPage}
            onPageChange={(i) => setCurrentPage(i.selected)}
        />
    );

}

export default Pagination;