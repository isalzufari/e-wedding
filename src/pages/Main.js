import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Main = () => {
  const [catalogues, setCatalogues] = useState([]);

  useEffect(() => {
    getCataloguesHandler();
  }, []);

  const getCataloguesHandler = async () => {
    const data = await api.getCatalogues();
    setCatalogues(data);
  }

  return (
    <div className='row'>
      {catalogues.map((catalogue, key) => (
        <div className='col-sm-12 col-md-4'>
          <div key={key} class="card">
            <img src={catalogue.image_url} height={300} style={{ objectFit: 'cover' }} className="card-img-top" alt={catalogue.package_name} />
            <div className="card-body">
              <Link to={`/${catalogue.slug}`} className='stretched-link text-decoration-none text-dark'>
                {catalogue.package_name}
              </Link>
              <p>Rp. {catalogue.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Main