import React, { Children } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StylesBaseVariant } from '../../utils/constants'

interface IComposableRowProps{
  container?: any,
  styles?: StylesBaseVariant
  errorTextStyles?:StylesBaseVariant
  setParentRef?:any;
  shiftFocus?:any;
  rowIndex?:any;
}

/**
 *  @internal
 */
const ComposableRow:React.FC<IComposableRowProps> = (props) => {
  const [errorTextMap,setErrorTextMap] = React.useState({})
  const [rowErrorText,setRowErrorText] = React.useState('');
  const {children} = props

  const setErr = (index,error)=>{
    setErrorTextMap((prev)=>({
      ...prev,
      [index]:error
    }))
  };

  React.useEffect(()=>{
    const length = React.Children.toArray(children).length; 
    let errorText = '';
    for(let i = 0;i<length;i++){
      if(errorTextMap[i]){
        errorText += `${errorTextMap[String(i)]}. `;
      }
    }
    setRowErrorText(errorText);
  },[errorTextMap]);
  
  const iterateOverChildren = (children) => {
    return React.Children.map(children, (child,index) => {
      if (!React.isValidElement(child)) return child;
      return React.cloneElement(child,
        {containerMethods:{
            setErrorText: (errorText)=>{setErr(index,errorText)},
            setRef:(ref,id)=>{props?.setParentRef(props.rowIndex+index,ref,id)},
            shiftFocus:props?.shiftFocus
          }
      } as Partial<unknown>)
    })
  };
  
return (
    <View>
      <View style={{...DEFAULT_ROW_STYLES.base,...props?.styles?.base}}>
      {iterateOverChildren(children)}
      </View>
      <Text style={props?.errorTextStyles?.base || {}}>{rowErrorText}</Text>
    </View>
  )
}

const DEFAULT_ROW_STYLES = StyleSheet.create({
    base:{
      display:'flex',
      flexDirection:'row',
    }
});

export default ComposableRow;
