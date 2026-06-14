import { useState } from 'react'
import demoItems from '../data/demoItems.js'

function DemoCard({ href, img, title }) {
  return (
    <div className="col-lg-4 col-md-6 col-12">
      <div className="single-demo">
        <div className="inner">
          <div className="thumbnail">
            <a href={href}>
              <img className="w-100" src={img} alt="Personal Portfolio" />
              <span className="overlay-content">
                <span className="overlay-text">View Demo <i className="feather-external-link"></i></span>
              </span>
            </a>
          </div>
          <div className="inner">
            <h3 className="title"><a href={href}>{title}</a></h3>
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dark')

  return (
    <div className={`demo-modal-area${isOpen ? ' open' : ''} ${activeTab === 'dark' ? 'dark-version' : 'active-light'}`}>
      <div className="wrapper">
        <div className="tmp-modal-inner">
          <div className="close-icon">
            <button className="demo-close-btn" onClick={() => setIsOpen(false)}><span><i className="fa-sharp fa-light fa-xmark"></i></span></button>
          </div>
          <div className="demo-top text-center">
            <h4 className="title">Reeni</h4>
            <p className="subtitle">A personal portfolio website is your digital resume—a place to showcase your work,
              skills, and achievements.</p>
          </div>
          <ul className="popuptab-area nav nav-tabs" id="popuptab" role="tablist">
            <li className="nav-item">
              <a className={`nav-link demo-dark${activeTab === 'dark' ? ' active' : ''}`} id="demodark-tab" href="#demodark" role="tab" aria-controls="demodark" aria-selected={activeTab === 'dark'} onClick={(e) => { e.preventDefault(); setActiveTab('dark') }}>Dark Demo</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link demo-light${activeTab === 'light' ? ' active' : ''}`} id="demolight-tab" href="#demolight" role="tab" aria-controls="demolight" aria-selected={activeTab === 'light'} onClick={(e) => { e.preventDefault(); setActiveTab('light') }}>Light Demo</a>
            </li>
          </ul>
          <div className="tab-content" id="popuptabContent">
            <div className={`tab-pane${activeTab === 'dark' ? ' show active' : ''}`} id="demodark" role="tabpanel" aria-labelledby="demodark-tab">
              <div className="content">
                <div className="row">
                  {demoItems.map((item) => (
                    <DemoCard key={`dark-${item.title}`} href={item.dark.href} img={item.dark.img} title={item.title} />
                  ))}
                </div>
              </div>
            </div>

            <div className={`tab-pane${activeTab === 'light' ? ' show active' : ''}`} id="demolight" role="tabpanel" aria-labelledby="demolight-tab">
              <div className="content">
                <div className="row">
                  {demoItems.map((item) => (
                    <DemoCard key={`light-${item.title}`} href={item.light.href} img={item.light.img} title={item.title} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoModal
