import React, { useRef, useState, useEffect } from 'react';
import { FiArrowLeft, FiEdit, FiTrash2, FiPrinter } from 'react-icons/fi';
import { animated, useSpring } from 'react-spring';
import { useReactToPrint } from 'react-to-print';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './styles.css'

const PrintButton = ({ id, tipoMoneda,numCotizacion,nomCliente}) => {
  const componentRef = useRef();
  const [cotizacion, setCotizacion] = useState(null); 
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
      axios
        .get(`https://65dd3395e7edadead7ed7f52.mockapi.io/Cotizacion/detail/${id}`)
        .then((res) => {
          setCotizacion(res.data);
          const subtotalValue = res.data.Productos.reduce(
            (acc, producto) => acc + producto.Cantidad * producto.PrecioUnitario,
            0
          );
          const igvValue = subtotalValue * 0.18;
          const totalValue = subtotalValue + igvValue;

          setSubtotal(subtotalValue);
          setIgv(igvValue);
          setTotal(totalValue);
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  const handlePrintClick = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <button className="btn btn-primary" onClick={handlePrintClick}>
        <FiPrinter />
      </button>
      {/* Here we use the component ref to pass the reference of the component to print */}
      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          {/* Here you can put the content you want to print */}
          <PrintableContent
            cotizacion={cotizacion}
            tipoMoneda={tipoMoneda}
            subtotal={subtotal}
            igv={igv}
            total={total}  
            animProps={animProps}
            numCotizacion={numCotizacion}
            nomCliente={nomCliente}
          />
        </div>
      </div>
    </>
  );
};

const PrintableContent = ({
  cotizacion,
  tipoMoneda,
  subtotal,
  igv,
  total,
  numCotizacion,
  nomCliente,
  handleDeleteProduct,
  deletingProduct,
  animProps,
}) => {
  if (!cotizacion) {
    // Si cotizacion no está definida, puedes mostrar un mensaje o realizar otra lógica
    return <div>No hay datos de cotización</div>;
  }
return (
  <div className="container printable-content-container" style={{ margin: '100px 100px 100px 100px' }}>
  <div className="row">
    <div className="col">
      <h2 className="m-0">Detalle de Cotización {`COT[${String(numCotizacion).padStart(8, '0')}]`}</h2>
    </div>
  </div>
  <div className="row mt-3">
    <div className="col">
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Producto</th>
            <th className="text-center" style={{ width: '10%' }}>Cantidad</th>
            <th className="text-center" style={{ width: '20%' }}>Precio Unitario</th>
            <th className="text-center" style={{ width: '15%' }}>SubTotal</th>
            <th className="text-center" style={{ width: '15%' }}>Igv</th>
            <th className="text-center" style={{ width: '15%' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {cotizacion.Productos.map((producto) => (
            <tr key={producto.Nombre} style={animProps}>
              <td style={{ width: '20%' }}>{producto.Nombre}</td>
              <td className="text-center" style={{ width: '10%' }}>{producto.Cantidad}</td>
              <td className="text-center" style={{ width: '20%' }}>
                {tipoMoneda}{' '}
                {producto.PrecioUnitario.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="text-center" style={{ width: '15%' }}>
                {tipoMoneda}{' '}
                {(producto.Cantidad * producto.PrecioUnitario).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="text-center" style={{ width: '15%' }}>
                {tipoMoneda}{' '}
                {((producto.Cantidad * producto.PrecioUnitario) * 0.18).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="text-center" style={{ width: '15%' }}>
                {tipoMoneda}{' '}
                {(((producto.Cantidad * producto.PrecioUnitario) * 1.18).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  <div className="row mt-3 printable-resumen-container">
   <div className="col-6"></div>
   <div className="col-6">
    <table className="table">
      <tbody>
        <tr className="table-warning">
          <td className="text-right" style={{ width: '100px' }}>SUBTOTAL:</td>
          <td className="text-center">
            <span>{tipoMoneda} {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </td>
        </tr>
        <tr className="table-warning">
          <td className="text-right" style={{ width: '100px' }}>IGV:</td>
          <td className="text-center">
            <span>{tipoMoneda} {igv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </td>
        </tr>
        <tr className="table-success">
          <td className="text-right" style={{ width: '100px' }}>TOTAL:</td>
          <td className="text-center">
            <span>{tipoMoneda} {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</div>
);
 
};

export default PrintButton;
