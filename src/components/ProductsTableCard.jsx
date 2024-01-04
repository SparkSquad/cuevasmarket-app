import { Button, Card, Form, InputGroup, ButtonGroup } from "react-bootstrap";
import { strings } from "../localization";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { useEffect, useState } from "react";
import { ProductsServiceResult, searchProducts } from "../services/products.service";
import "./ProductsTableCard.css";

let tableNameColumnFilter;

const handleGuestSearchInputChange = (event) => {
    tableNameColumnFilter(event.target.value);
}

const ProductsTableCard = () => {
    const [products, setProducts] = useState([]); 
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const branchesPerPage = 15;

    useEffect(() => {
        fetchSearchResults(searchQuery, currentPage);
    }, []);

    const fetchSearchResults = async (searchQuery, page) => {
        try {
            let r = await searchProducts(searchQuery, branchesPerPage, page);
            switch(r.result) {
                case ProductsServiceResult.Success: {
                    let responseData = r.data;
                    setProducts(responseData.results);
                    setCurrentPage(responseData.currentPage);
                    setTotalPages(responseData.totalPages);
                    return;
                }
                case ProductsServiceResult.UnknownError: {
                    let response = await r.json();
                    console.log(response);
                    return;
                }
                default: {
                    console.log("Server returned non-200 status code");
                    return;
                }
            }
        }
        catch (e) {
            console.log(`Failed to fetch search results: ${e}`);
        }
        setProducts([]);
    };

    const handleProductSearchInputChange = async (e) => {
        setSearchQuery(e.target.value);
        await fetchSearchResults(e.target.value, currentPage);
    }

    const handlePageChange = (page) => {
        fetchSearchResults(searchQuery, page);
    }

    const handleNextPage = () => {
        if(currentPage < totalPages) {
            fetchSearchResults(searchQuery, currentPage + 1);
        }
    }

    const handlePreviousPage = () => {
        if(currentPage > 1) {
            fetchSearchResults(searchQuery, currentPage - 1);
        }
    }

    return (
        <>
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center flex-wrap">
                    <h5 style={{margin: "0"}}>{strings.productsTableCard.header}</h5>
                    <div className="d-flex event-guests-button-bar">
                        <InputGroup>
                            <Form.Control placeholder={strings.productsTableCard.searchBarPlaceholder} aria-label="Search" onChange={handleProductSearchInputChange}/>
                            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                        </InputGroup>
                    </div>
                </Card.Header>
                <Card.Body>
                    <BootstrapTable 
                        keyField="id"
                        data={products}
                        hover={true}
                        striped={true}
                        rowClasses={"product-table-cell"}
                        columns={[
                            {
                                dataField: "barcode",
                                text: strings.productsTableCard.barcodeColumn
                            },
                            {
                                dataField: "name",
                                text: strings.productsTableCard.nameColumn
                            },
                            {
                                dataField: "price",
                                text: strings.productsTableCard.priceColumn,
                                formatter: (cell, row) => {
                                    return `$ ${cell}`;
                                }
                            },
                            {
                                dataField: "provider",
                                text: strings.productsTableCard.providerColumn
                            },
                            {
                                dataField: "options",
                                classes: "d-flex justify-content-center",
                                formatter: (cell, row, rowIndex, formatExtraData) => {
                                    return (
                                        <ButtonGroup>
                                            <Button variant="secondary" className="text-nowrap"><i className="bi bi-pencil-fill"></i></Button>
                                            <Button variant="danger" className="text-nowrap"><i className="bi bi-x-lg"></i></Button>
                                        </ButtonGroup>
                                    );
                                }
                            }
                        ]}
                        classes="table-sm"/>
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex justify-content-between align-items-center">
                        <nav aria-label="Page navigation" className="navigation">
                            <ul className="pagination justify-content-center mb-0">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <a className="page-link" href="#!" onClick={handlePreviousPage}><span aria-label="previous page">&laquo;</span></a>
                                </li>
                                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => {
                                    return (
                                        <li className={`page-item ${page === currentPage ? "active" : ""}`} key={page}>
                                            <a className="page-link" href="#!" onClick={() => handlePageChange(page)}>{page}</a>
                                        </li>
                                    )
                                })}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <a className="page-link" href="#!" onClick={handleNextPage}><span aria-label="next page">&raquo;</span></a>
                                </li>
                            </ul>
                        </nav>
                        <div>
                            <Button variant="primary" className="text-nowrap"><i className="bi bi-plus-lg"></i> {strings.productsTableCard.addProductButton}</Button>
                        </div>
                    </div>
                </Card.Footer>
            </Card>
        </>
    )
}

export default ProductsTableCard;
