import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import api from '../utils/api';

const Detail = () => {
  const location = useLocation();
  const namePlace = location.pathname.split('/');
  const slug = namePlace[1];

  const [isLoad, setIsLoad] = useState(true);
  const [catalogues, setCatalogues] = useState(true);
  const [payload, setPayload] = useState({
    catalogueId: 0,
    wedding_date: ''
  });

  useEffect(() => {
    const onHandlerSpotBySlug = async (slug) => {
      setIsLoad(true);
      const data = await api.getCataloguesBySlug({ slug });
      setCatalogues(data);
      setPayload({ ...payload, catalogueId: data.id })
      setIsLoad(false);
    }

    onHandlerSpotBySlug(slug);
  }, [slug]);

  const onHandleAddToCart = async () => {
    const { status } = await api.addOrders({ payload });
    if (status === 'success') {
      alert('Orders berhasil ditambah!')
    }
  }

  return (
    <div className='row'>
      <div className="col">
        <img style={{ width: '-webkit-fill-available', objectFit: 'cover' }} className='img-fluid rounded shadow' src={catalogues.image_url} alt={catalogues.package_name} />
      </div>
      <div className="col">
        <h5>{catalogues.package_name}</h5>
        <p>{catalogues.description}</p>
        <p>Rp. {catalogues.price}</p>
        <input onChange={(e) => setPayload({ ...payload, wedding_date: e.target.value })} className='form-control mb-3' type='datetime-local' />
        <button onClick={() => onHandleAddToCart()} className='btn btn-primary'>Cart</button>
      </div>
    </div>
  )
}

export default Detail