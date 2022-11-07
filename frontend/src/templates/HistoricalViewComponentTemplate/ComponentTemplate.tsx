// react
import React, { ReactElement } from 'react';

// styles
import './ComponentTemplate.css';

interface HistoricalViewComponentTemplateProps {
  children: ReactElement,
  title: string
}

const ComponentTemplate = ( { children, title }:  HistoricalViewComponentTemplateProps ) => {
  
  return (

    <div className="component-wrapper">

      <div className="component-header">
        <div className="title-container">
          <h2>{title}</h2>
        </div>
      </div>

      <div className="component-body">
        {children}
      </div>
      
    </div>

  )
}

export default ComponentTemplate;