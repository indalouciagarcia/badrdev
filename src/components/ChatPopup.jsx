import { useState } from 'react'

function ChatPopup() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="ready-chatting-option tmp-ready-chat">
      <input type="checkbox" id="click" />
      <label htmlFor="click">
        <i className="fab fa-facebook-messenger"></i>
        <i className="fas fa-times"></i>
      </label>
      <div className="wrapper">
        <div className="head-text">
          Discutons ? - En ligne
        </div>
        <div className="chat-box">
          <div className="desc-text">
            Remplissez le formulaire ci-dessous pour démarrer une conversation directement avec moi.
          </div>
          <form className="tmp-dynamic-form" onSubmit={handleSubmit}>
            <div className="field">
              <input className="input-field" name="name" placeholder="Votre Nom" type="text" value={form.name} onChange={handleChange} required />
            </div>
            <div className="field">
              <input className="input-field" name="email" placeholder="Votre Email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="field textarea">
              <textarea className="input-field" placeholder="Votre Message" name="message" value={form.message} onChange={handleChange} required></textarea>
            </div>
            <div className="field">
              <button name="submit" type="submit">Envoyer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatPopup
