import { Link } from 'react-router-dom'

function Breadcrumb({ title }) {
  return (
    <div className="breadcrumb-area breadcrumb-bg">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="breadcrumb-inner text-center">
              <h1 className="title split-collab">{title}</h1>
              <ul className="page-list">
                <li className="tmp-breadcrumb-item"><Link to="/">Accueil</Link></li>
                <li className="icon"><i className="fa-solid fa-angle-right"></i></li>
                <li className="tmp-breadcrumb-item active">{title}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb
