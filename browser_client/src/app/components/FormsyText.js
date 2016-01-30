import React from 'react'
import BaseFormsyText from 'formsy-material-ui/lib/FormsyText'


const FormsyText = ({ style, ...rest }) =>
    <BaseFormsyText
     style={{ marginBottom: '3rem', ...style }}
     {...rest} />


export default FormsyText
