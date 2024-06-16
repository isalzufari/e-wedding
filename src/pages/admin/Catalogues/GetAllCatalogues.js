import React, { useState, useEffect } from 'react'
import api from '../../../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const GetAllCatalogues = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const getCatalogues = async () => {
      const data = await api.adminGetCatalogues();
      setCatalogues(data);
      setRefresh(false);
    }
    getCatalogues();
  }, [refresh]);

  const onHandleDelete = async ({ cataloguesId }) => {
    const { message } = await api.deleteCatalogues({ cataloguesId })
    setRefresh(true);
    alert(message);
  }

  const onHandleChangeStatus = async ({ cataloguesId }) => {
    await api.updateStatusCatalogues({ cataloguesId })
    setRefresh(true);
  }

  return (
    <div className='card'>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h1 className='h4'>Katalog</h1>
          <Link to='/admin/catalogues/add' className='btn btn-primary'>Tambah</Link>
        </div>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nama</th>
              <th scope="col">Harga</th>
              <th scope="col">Status</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {catalogues.map((catalogue, key) => (
              <tr>
                <th scope="row">{key + 1}</th>
                <td onClick={() => navigate(`/${catalogue.slug}`)} style={{ cursor: 'pointer' }}>{catalogue.package_name}</td>
                <td>{catalogue.price}</td>
                <td>
                  <div class="form-check form-switch">
                    <input onChange={() => onHandleChangeStatus({ cataloguesId: catalogue.id })} checked={catalogue.isPublished} class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                  </div>
                </td>
                <td>
                  <Link to={`/admin/catalogues/update/${catalogue.id}`} className='btn btn-primary mx-3'>Ubah</Link>
                  <button onClick={() => onHandleDelete({ cataloguesId: catalogue.id })} className='btn btn-danger mx-3'>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GetAllCatalogues;
