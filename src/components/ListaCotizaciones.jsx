import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { FiTrash2,FiEye  } from 'react-icons/fi';
import Swal from 'sweetalert2';
import PrintButton from './PrintButton';
import './styles.css'

const ListaCotizaciones = () => {
  const [data, setData] = useState([]);
  const [filteredDataTotal, setFilteredDataTotal] = useState([]);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(50);
  const rowsPerPage = 10;

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.IdCotizacion,
      sortable: true,
      width:'100px'
    },
    {
      name: 'Documento',
      selector: (row) => `COT[${String(row.NumCotizacion).padStart(8, '0')}]`,
      sortable: true,
      width:'200px'
    },
    {
      name: 'Cliente',
      selector: (row) => row.NomCliente.toUpperCase(),
      sortable: true,
      width: '320px',
    },
    {
      name: 'Total',
      selector: (row) => `${row.TipoMoneda} ${row.Total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sortable: false,
      width: '200px',
    },
    {
      name: 'Estado',
      selector: (row) => (
        <div>
          {row.NomEstado === 'Activo' ? (
            <div className="btn btn-success" style={{ padding: '5px', borderRadius: '5px', color: 'white' , width:"150px" }}>
              Activo
            </div>
          ) : (
            <div className="btn btn-warning" style={{ padding: '5px', borderRadius: '5px', color: 'black' , width:"150px" }}>
              Inactivo
            </div>
          )}
        </div>
      ),
      sortable: true,
      width: '200px',
    },
    {
      name: 'Detalle',
      selector: (row) => (
        <a href={`/cotizaciones/${row.id}/${row.TipoMoneda}`} className="btn btn-primary btn-animated">
           <FiEye />
        </a>
      ),
      width: '150px',
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div>
          <button
            className="btn btn-danger btn-animated mr-2"
            onClick={() => handleDeleteConfirmation(row.IdCotizacion)}
          >
            <FiTrash2 />
          </button>
          
            
           <button  className="btn btn-animated">
          <PrintButton
            id={row.IdCotizacion}
            tipoMoneda={row.TipoMoneda}
            numCotizacion={row.NumCotizacion}
            nomCliente={row.NomCliente} 
          />
          </button>
        </div>
      ),
      width: '150px',
    },
        
  ];

   useEffect(() => {
    axios
      .get('https://65dd3395e7edadead7ed7f52.mockapi.io/Cotizacion/cotizaciones')
      .then((res) => {
        setData(res.data);
        updateFilteredData(page);
        setFilteredDataTotal(res.data.slice(0, 10));
      })
      .catch((err) => console.log(err));
  }, []); 

  const updateFilteredData = (currentPage) => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setFilteredDataTotal(data.slice(startIndex, endIndex));
  };

  const handlePageChange = (page) => {
    setPage(page-1);
    updateFilteredData(page-1);
  };

  const handleDeleteConfirmation = (idCotizacion) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La cotización será eliminada permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteCotizacion(idCotizacion);
      }
    });
  };

  const handleDeleteCotizacion = (idCotizacion) => {
    // Eliminar el elemento directamente del estado local
    const updatedData = filteredDataTotal.filter((cotizacion) => cotizacion.IdCotizacion !== idCotizacion);
    const updatedData2 = data.filter((cotizacion) => cotizacion.IdCotizacion !== idCotizacion);
    setData(updatedData2);
    setFilteredDataTotal(updatedData);  
    setTotalRecords(prevTotalRecords => prevTotalRecords - 1);
    Swal.fire('Eliminado', 'La cotización ha sido eliminada correctamente.', 'success');
  };

  return (
    <DataTable
      title="Cotizaciones"
      columns={columns}
      data={filteredDataTotal}
      pagination
      paginationServer
      paginationPerPage={rowsPerPage}
      paginationRowsPerPageOptions={[rowsPerPage, 20, 50]}
      highlightOnHover
      striped
      pointerOnHover
      noHeader
      subHeader
      subHeaderComponent={<h3>Total: {totalRecords}</h3>}
      onChangePage={handlePageChange}
      paginationTotalRows={totalRecords} 
    />
  );
};

export default ListaCotizaciones;