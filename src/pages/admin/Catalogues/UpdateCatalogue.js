import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toBase64 } from '../../../utils';
import api from '../../../utils/api';

const UpdateCatalogue = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const namePlace = location.pathname.split('/');
  const cataloguesId = namePlace[4];

  const [payload, setPayload] = useState({
    package_name: '',
    description: '',
    price: 0,
    isPublished: 1,
    image: '',
  });

  useEffect(() => {
    const getCataloguesById = async () => {
      const data = await api.getCataloguesById({ cataloguesId });
      const res = await fetch(data.image);
      const blob = await res.blob();
      const base64Image = await toBase64(blob);
      setPayload({
        ...data,
        image: base64Image,
      });
    };

    getCataloguesById();
  }, []);

  const onHandleFileEvent = async (e) => {
    if (!e.target.files[0]) return;
    if (e.target.files[0].size > 1048576) {
      alert("File is to big");
      return;
    }
    const file = e.target.files[0];
    const base64Image = await toBase64(file);
    setPayload({ ...payload, image: base64Image });
  }

  const onUpdateCatalogues = async () => {
    const { status } = await api.updateCatalogues({ cataloguesId, payload });
    if (status === 'success') {
      alert('Katalog berhasil diubah!')
      return navigate('/admin/catalogues');
    }
  }

  return (
    <div class="card">
      <div class="card-body">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
          <Link to="/admin/catalogues" class="btn btn-outline-primary" type="button">Kembali</Link>
        </div>
        <div className='row'>
          <div className="col">
            <div class="mb-3">
              <input onChange={(e) => onHandleFileEvent(e)} class="form-control" type="file" accept='image/png, image/jpeg' id="formFile" />
            </div>
            <div className="mb-3">
              <img style={{ width: '-webkit-fill-available', objectFit: 'cover' }} className='img-fluid rounded'
                src={payload.image === '' ? 'https://img.freepik.com/free-photo/textured-background-white-tone_53876-128610.jpg' : payload.image}
                alt={payload.package_name} />
            </div>
          </div>

          <div className="col">
            <div class="form-floating mb-3">
              <input onChange={(e) => setPayload({ ...payload, package_name: e.target.value })} value={payload.package_name} type="email" class="form-control" id="floatingInput" placeholder="title" />
              <label for="floatingInput">Nama Paket</label>
            </div>
            <div class="form-floating mb-3">
              <input onChange={(e) => setPayload({ ...payload, price: e.target.value })} value={payload.price} type="email" class="form-control" id="floatingInput" placeholder="title" />
              <label for="floatingInput">Harga</label>
            </div>
            <div class="form-floating">
              <textarea onChange={(e) => setPayload({ ...payload, description: e.target.value })} value={payload.description} class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: 300 }}></textarea>
              <label for="floatingTextarea2">Deskripsi</label>
            </div>
          </div>
        </div>
        <div class="d-grid gap-2 mt-3">
          <button onClick={() => onUpdateCatalogues()} class="btn btn-primary" type="button">Ubah</button>
        </div>
      </div>
    </div>
  )
}

export default UpdateCatalogue;
