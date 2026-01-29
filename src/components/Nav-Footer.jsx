

import React from 'react'
import Navbar from './(hero-nav)/Navbar'
import { Footer } from './Footer'

function NavFooterWrapper({children}) {
  return (
    <>
        {/* <Navbar /> */}
        <Navbar />
        {/* Page Content */}
        {children}
        {/* <Footer /> */}
        <Footer />
    </>
  )
}

export default NavFooterWrapper