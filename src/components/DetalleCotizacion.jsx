import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useSpring, animated } from 'react-spring';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

const DetalleCotizacion = () => {
  const [cotizacion, setCotizacion] = useState(null);
  const { id, tipoMoneda } = useParams();
  const [subtotal, setSubtotal] = useState(0);
  const [igv, setIgv] = useState(0);
  const [total, setTotal] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const animProps = useSpring({
    opacity: deletingProduct ? 0 : 1,
    transform: deletingProduct ? `translate3d(0, -20px, 0)` : 'translate3d(0, 0, 0)',
  });

  useEffect(() => {
    if (id) {
      axios.get(`https://65dd3395e7edadead7ed7f52.mockapi.io/Cotizacion/detail/${id}`)
        .then(res => {
          setCotizacion(res.data);
          const subtotalValue = res.data.Productos.reduce((acc, producto) => acc + (producto.Cantidad * producto.PrecioUnitario), 0);
          const igvValue = subtotalValue * 0.18;
          const totalValue = subtotalValue + igvValue;

          setSubtotal(subtotalValue);
          setIgv(igvValue);
          setTotal(totalValue);
        })
        .catch(err => console.log(err));
    }
  }, [id]);

  if (!cotizacion || !id) {
    return <div>Cargando...</div>;
  }

  const handleDeleteProduct = (producto) => {
  MySwal.fire({
    title: '¿Está seguro?',
    text: '¿Desea eliminar el registro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      setDeletingProduct(producto);

      setTimeout(() => {
        const updatedProductos = cotizacion.Productos.filter(p => p.Nombre !== producto.Nombre);

        setCotizacion(prevCotizacion => ({
          ...prevCotizacion,
          Productos: updatedProductos
        }));

        const subtotalValue = updatedProductos.reduce((acc, p) => acc + (p.Cantidad * p.PrecioUnitario), 0);
        const igvValue = subtotalValue * 0.18;
        const totalValue = subtotalValue + igvValue;

        setSubtotal(subtotalValue);
        setIgv(igvValue);
        setTotal(totalValue);
        setDeletingProduct(null);
      }, 300);
    }
  });
};

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-auto">
          <Link to="/" className="btn btn-primary">
            <FiArrowLeft className="mr-2" />
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h2 className="m-0">Detalle de Cotización</h2>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-center">Precio Unitario</th>
                  <th className="text-center">SubTotal</th>
                  <th className="text-center">Igv</th>
                  <th className="text-center">Total</th>
                  <th className="text-center"></th>
                </tr>
              </thead>
              <tbody>
                {cotizacion.Productos.map(producto => (
                  <animated.tr key={producto.Nombre} style={animProps}>
                    <td>{producto.Nombre}</td>
                    <td className="text-center">{producto.Cantidad}</td>
                    <td className="text-center">{tipoMoneda} {producto.PrecioUnitario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="text-center">{tipoMoneda} {(producto.Cantidad * producto.PrecioUnitario).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="text-center">{tipoMoneda} {((producto.Cantidad * producto.PrecioUnitario) * 0.18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="text-center">{tipoMoneda} {(((producto.Cantidad * producto.PrecioUnitario) * 1.18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</td>
                    <td className="text-center">
                      <button 
                        className="btn btn-warning btn-sm"
                      >
                        <FiEdit />
                      </button>
                      <span style={{ marginRight: '8px' }} /> {/* Espacio adicional */}
                      <animated.button
                        onClick={() => handleDeleteProduct(producto)}
                        className="btn btn-danger btn-sm"
                        style={deletingProduct === producto ? { opacity: 0 } : {}}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Eliminar Cotización"
                      >
                        <FiTrash2 />
                      </animated.button>
                    </td>
                  </animated.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
   <div className="row">
      <div className="col-md-11 text-right" style={{ textAlign: 'right' }}>
        <div className="form-group">
          <h6>SUBTOTAL:</h6>
        </div>
      </div>
      <div className="col-md-1 text-right" style={{ textAlign: 'right' }}>
        <div className="form-group">
           <span>{tipoMoneda} {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
      <div className="col-md-11 text-right" style={{ textAlign: 'right' }}>
        <div className="form-group">
          <h6>IGV:</h6>
        </div>
      </div>
      <div className="col-md-1 text-right" style={{ textAlign: 'right' }}>
        <div className="form-group">
           <span>{tipoMoneda} {igv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>   
      <div className="col-md-11 text-right" style={{ textAlign: 'right' }}>
        <div className="form-group">
          <h6>TOTAL</h6>
        </div>
      </div>
      <div className="col-md-1 text-right" style={{ textAlign: 'right' }}>
        <div className="form-group">
          <span>{tipoMoneda} {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default DetalleCotizacion;
