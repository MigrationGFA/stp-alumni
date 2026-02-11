

import React from 'react'

function Container({ children, className = "" }){
  return (
    <div className={`mx-auto max-w-360 px-6 md:px-12 lg:px-20 w-full ${className}`}>
      {children}
    </div>
  );
};


export default Container