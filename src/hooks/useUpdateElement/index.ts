import React from "react"
import CollectElement from "src/core/CollectElement"
import { CollectElementProps } from "src/utils/constants"

const useUpdateElement = (
    props: CollectElementProps,
    element: CollectElement | null,
  ): void => {
    React.useEffect(() => {
      if (element && props?.container) {
        element.update({
          table: props.table,
        })
      }
    }, [props?.table])
  
    React.useEffect(() => {
      if (element && props?.container) {
        element.update({
          column: props.column,
        })
      }
    }, [props?.column])
  
    React.useEffect(() => {
      if (element && props?.container) {
        element.update({
          label: props.label,
        })
      }
    }, [props?.label])
  
    React.useEffect(() => {
      if (element && props?.container) {
        element.update({
          placeholder: props.placeholder,
        })
      }
    }, [props?.placeholder])

    React.useEffect(() => {
      if (element && props?.container) {
        element.update({
          validations: props.validations,
        })
      }
    }, [props?.validations])

    React.useEffect(() => {
      if (element && props?.container) {
        element.update({
          inputStyles: props.inputStyles,
        })
      }
    }, [props?.inputStyles])

    React.useEffect(() => {
      if (element && props?.container) {
        element.update({
          labelStyles: props.labelStyles,
        })
      }
    }, [props?.labelStyles])

    React.useEffect(() => {
      if (element && props?.container) {
        element.update({
          errorTextStyles: props.errorTextStyles,
        })
      }
    }, [props?.errorTextStyles])
  
  }
  
  export default useUpdateElement;