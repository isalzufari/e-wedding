import React, { useState, useEffect } from 'react'
import api from '../../../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const GetAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const getOrders = async () => {
      const data = await api.getOrders();
      setOrders(data);
      setRefresh(false);
    }
    getOrders();
  }, [refresh]);

  const onHandleDelete = async ({ ordersId }) => {
    const { message } = await api.deleteOrders({ ordersId })
    setRefresh(true);
    alert(message);
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
              <th scope="col">Nama</th>
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
                  <button onClick={() => onHandleDelete({ ordersId: order.id })} className='btn btn-danger mx-3'>Hapus</button>
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
