import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Contact from './pages/Contact.jsx'
import Blog from './pages/Blog.jsx'
import BlogClassic from './pages/BlogClassic.jsx'
import BlogDetails from './pages/BlogDetails.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'
import QuotePage from './pages/QuotePage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DashboardProjects from './pages/dashboard/DashboardProjects.jsx'
import ProjectFormPage from './pages/dashboard/ProjectFormPage.jsx'
import DashboardServices from './pages/dashboard/DashboardServices.jsx'
import ServiceFormPage from './pages/dashboard/ServiceFormPage.jsx'
import ServiceDetail from './pages/dashboard/ServiceDetail.jsx'
import DashboardProfile from './pages/dashboard/DashboardProfile.jsx'
import DashboardContent from './pages/dashboard/DashboardContent.jsx'
import ContentFormPage from './pages/dashboard/ContentFormPage.jsx'
import DashboardSkills from './pages/dashboard/DashboardSkills.jsx'
import SkillFormPage from './pages/dashboard/SkillFormPage.jsx'
import DashboardBlog from './pages/dashboard/DashboardBlog.jsx'
import BlogFormPage from './pages/dashboard/BlogFormPage.jsx'
import DashboardQuotes from './pages/dashboard/DashboardQuotes.jsx'
import DashboardTechLogos from './pages/dashboard/DashboardTechLogos.jsx'
import DashboardSettings from './pages/dashboard/DashboardSettings.jsx'
import DashboardCRM from './pages/dashboard/DashboardCRM.jsx'
import DashboardTemplates from './pages/dashboard/DashboardTemplates.jsx'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog-classic" element={<BlogClassic />} />
        <Route path="/blog-details/:id" element={<BlogDetails />} />
        <Route path="/projets" element={<Projects />} />
        <Route path="/projets/:id" element={<ProjectDetails />} />
        <Route path="/devis" element={<QuotePage />} />
      </Route>
      
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<DashboardProfile />} />
        <Route path="/dashboard/content" element={<DashboardContent />} />
        <Route path="/dashboard/content/new/:type" element={<ContentFormPage />} />
        <Route path="/dashboard/content/edit/:type/:id" element={<ContentFormPage />} />
        
        <Route path="/dashboard/projects" element={<DashboardProjects />} />
        <Route path="/dashboard/projects/new" element={<ProjectFormPage />} />
        <Route path="/dashboard/projects/edit/:id" element={<ProjectFormPage />} />
        
        <Route path="/dashboard/services" element={<DashboardServices />} />
        <Route path="/dashboard/services/new" element={<ServiceFormPage />} />
        <Route path="/dashboard/services/edit/:id" element={<ServiceFormPage />} />
        <Route path="/dashboard/services/:id" element={<ServiceDetail />} />
        
        <Route path="/dashboard/skills" element={<DashboardSkills />} />
        <Route path="/dashboard/skills/new" element={<SkillFormPage />} />
        <Route path="/dashboard/skills/edit/:id" element={<SkillFormPage />} />
        
        <Route path="/dashboard/blog" element={<DashboardBlog />} />
        <Route path="/dashboard/blog/new" element={<BlogFormPage />} />
        <Route path="/dashboard/blog/edit/:id" element={<BlogFormPage />} />
        
        <Route path="/dashboard/quotes" element={<DashboardQuotes />} />
        <Route path="/dashboard/crm" element={<DashboardCRM />} />
        <Route path="/dashboard/templates" element={<DashboardTemplates />} />
        <Route path="/dashboard/tech-logos" element={<DashboardTechLogos />} />
        <Route path="/dashboard/settings" element={<DashboardSettings />} />
      </Route>
    </Routes>
  )
}

export default App
