import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';

const GetAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      const data = await api.getOrders();
      setOrders(data);
      setRefresh(false);
    }
    getOrders();
  }, [refresh]);

  const onHandleStatus = async ({ ordersId }) => {
    const { status, message } = await api.updateStatusOrders({ ordersId });
    if (status !== 'success') {
      alert(message);
    }
    setRefresh(true);
  }

  const onHandleDelete = async ({ ordersId }) => {
    const { message } = await api.deleteOrders({ ordersId });
    alert(message);
    setRefresh(true);
  }

  const onHandleOrdersById = async ({ ordersId }) => {
    const { name, email } = await api.getOrdersById({ ordersId });
    alert(`${name} ${email}`);
  }

  return (
    <div className='card'>
      <div className="card-body">
        <h1 className='h4'>Orders</h1>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Paket</th>
              <th scope="col">Harga</th>
              <th scope="col">Status</th>
              <th scope="col">Tanggal</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, key) => (
              <tr>
                <th scope="row">{key + 1}</th>
                <td onClick={() => onHandleOrdersById({ ordersId: order.id })} style={{ cursor: 'pointer' }}>{order.package_name}</td>
                <td>{order.price}</td>
                <td>{order.status === 1 ? <><span class="badge text-bg-success">Approved</span></> : <span class="badge text-bg-warning">Request</span>}</td>
                <td>{order.wedding_date}</td>
                <td>
                  <button onClick={() => onHandleStatus({ ordersId: order.id })} style={{ marginRight: 10 }} className='btn btn-primary'>Ubah</button>
                  <button onClick={() => onHandleDelete({ ordersId: order.id })} className='btn btn-danger'>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GetAllOrders;
