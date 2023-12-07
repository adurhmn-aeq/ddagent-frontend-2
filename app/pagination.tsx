import React, { useEffect, useState, Fragment } from "react";

export interface Props {
    totalRecords: number;
    pageLimit: number;
    pageNeighbours: number
    onPageChanged: (page: any) => void;
  }

function Pagination(props: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const LEFT_PAGE = "LEFT";
  const RIGHT_PAGE = "RIGHT";

  /**
   * Helper method for creating a range of numbers
   * range(1, 5) => [1, 2, 3, 4, 5]
   */
  const range = (from:number, to:number, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
      range.push(i);
      i += step;
    }
    return range;
  };

  // const pageLimit = typeof pageLimit === 'number' ? pageLimit : 30;
  // const totalRecords = typeof totalRecords === 'number' ? totalRecords : 0;

  // pageNeighbours can be: 0, 1 or 2
  // const pageNeighbours = typeof pageNeighbours === 'number'
  //   ? Math.max(0, Math.min(pageNeighbours, 2))
  //   : 0;

  const totalPages = Math.ceil(props.totalRecords / props.pageLimit);

  const gotoPage = (page:any) => {
    const currentPage = Math.max(0, Math.min(page, totalPages));

    const paginationData = {
      currentPage,
      totalPages,
      pageLimit: props.pageLimit,
      totalRecords: props.totalRecords,
    };

    setCurrentPage(currentPage);
    props.onPageChanged(paginationData);
  };

  useEffect(() => {
    gotoPage(1);
  }, []);

  const handleClick = (page:any) => (evt:any) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (evt:any) => {
    evt.preventDefault();
    gotoPage(currentPage - props.pageNeighbours * 1 - 1);
  };

  const handleMoveRight = (evt:any) => {
    evt.preventDefault();
    gotoPage(currentPage + props.pageNeighbours * 1 + 1);
  };

  /**
   * Let's say we have 10 pages and we set pageNeighbours to 2
   * Given that the current page is 6
   * The pagination control will look like the following:
   *
   * (1) < {4 5} [6] {7 8} > (10)
   *
   * (x) => terminal pages: first and last page(always visible)
   * [x] => represents current page
   * {...x} => represents page neighbours
   */

  const fetchPageNumbers = () => {
    // const totalPages = totalPages;
    // const currentPage = currentPage;
    // const pageNeighbours = pageNeighbours;

    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = props.pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - props.pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + props.pageNeighbours);

      let pages:any = range(startPage, endPage);

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  };

  const pages = fetchPageNumbers();
  return (
    <Fragment>
      {props.totalRecords >= props.pageLimit ? (
        <>
        <nav aria-label="Page navigation example">
            <ul className="list-style-none flex">
            {pages.map((page, index) => {
              if (page === LEFT_PAGE)
                return (
                //   <li key={index} className="page-item">
                //     <a
                //       className="page-link"
                //       href="#"
                //       aria-label="Previous"
                //       onClick={handleMoveLeft}
                //     >
                //       <span aria-hidden="true">&laquo;</span>
                //       <span className="sr-only">Previous</span>
                //     </a>
                //   </li>
                  <li key={index}>
                    <a
                        onClick={handleMoveLeft}
                        className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                        href="#"
                        >
                        <span aria-hidden="true">&laquo;</span>
                        <span className="sr-only">Previous</span>
                    </a>
                  </li>
                );

              if (page === RIGHT_PAGE)
                return (
                  <li key={index}>
                    <a
                      className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                      href="#"
                      aria-label="Next"
                      onClick={handleMoveRight}
                    >
                      <span aria-hidden="true">&raquo;</span>
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                  
                );

              return (
                <li
                    aria-current="page"
                  key={index}
                  className={`page-item${currentPage === page ? " active" : ""}`}
                >
                  <a 
                  className={`relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white ${
                    currentPage === page
                      ? "bg-primary-600 text-white" // Add active class for styling
                      : "text-neutral-600"
                  }`}
                   href="#" onClick={handleClick(page)}>
                    {page}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        </>
      ) : null}
    </Fragment>
  );
}

export default Pagination;
