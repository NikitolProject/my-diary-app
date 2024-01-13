import 'remixicon/fonts/remixicon.css'

import React from 'react'

export default ({
  icon, title, action, isActive = null,
}: any) => (
  <button
    className={`menu-item${isActive && isActive() ? ' is-active' : ''}`}
    onClick={action}
    title={title}
  >
   {localStorage.getItem("theme") == "dark" ? ( 
    <i className={`ri-${icon} text-white`}></i>
   ) : (
    <i className={`ri-${icon} text-black`}></i>
   )}
  </button>
)
