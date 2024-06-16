import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ authUser, onSignOut }) => {
  const location = useLocation();
  const namePlace = location.pathname.split('/');
  const slug = namePlace[1];

  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm">
      <div className="container p-2">
        <Link className="navbar-brand" to='/'></Link>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className={`nav-link ${slug === '' && 'active'}`} aria-current="page" to="/">beranda</Link>
          </li>
        </ul>

        {!authUser ? <div className="text-end">
          <Link to="login" type="button" className="btn btn-primary">sign-in</Link>
        </div> :
          <div className="flex-shrink-0 dropdown">
            <a href="#/" className="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <span>{authUser.name}</span>
            </a>
            <ul className="dropdown-menu text-small shadow">
              {authUser?.isAdmin === 1 ?
                <>
                  <li><Link to='/admin/catalogues' className="dropdown-item">Katalog</Link></li>
                  <li><Link to='/admin/orders' className="dropdown-item">Pesanan</Link></li>
                </>
                :
                <>
                  <li><Link to='/app/orders' className="dropdown-item">Pesanan</Link></li>
                </>
              }
              <li><a onClick={onSignOut} className="dropdown-item" href='/#'>Sign out</a></li>
            </ul>
          </div>
        }
        {/* </>
        } */}
      </div>
    </nav>
  )
}

export default Navigation