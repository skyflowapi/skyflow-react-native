import React, { useRef } from "react";
import ComposableRow from "../composableContainerRow";
import CoreComposableContainer from "../../core/ComposableContainer";
import _ from "lodash";
import SkyflowError from "../../utils/skyflow-error";
import SKYFLOW_ERROR_CODE from "../../utils/skyflow-error-code";

export interface IComposableContainer {
    container: CoreComposableContainer,
    onSubmit?: () => void
}


const ComposableContainer: React.FC<IComposableContainer> = (props) => {
    const containerRef = useRef([]);
    const { container, children } = props;
    const { layout, styles, errorTextStyles } = container.options;
    const childComponentArray = React.Children.toArray(children);

    const setParentRef = (index,elementRef,elementID)=>{
        containerRef.current[index] = {elementID:elementID,ref:elementRef};
    }

    const shiftFocus = (currentElementID)=>{
       let nextElementIndex
       containerRef.current.forEach((element,index)=>{
            if(element.elementID === currentElementID.current && (index + 1) !== containerRef.current.length){
                nextElementIndex = index + 1
            }
       });
       if(nextElementIndex){
            const nextElementRef = containerRef.current[nextElementIndex].ref ;
            if(nextElementRef) nextElementRef?.current?.focus();
       }
    }

    const getElements = () => {

        if(_.sum(layout) !== childComponentArray.length){
            throw new SkyflowError(SKYFLOW_ERROR_CODE.MISMATCH_ELEMENT_COUNT_LAYOUT_SUM, [], true);
        }

        let currentIndex = 0;
        return layout.map((rowCount, index) => {
            const rowView = <ComposableRow
                key={index}
                children={childComponentArray.slice(currentIndex, currentIndex + rowCount)}
                styles={styles}
                errorTextStyles={errorTextStyles}
                setParentRef={setParentRef}
                shiftFocus={shiftFocus}
                rowIndex={currentIndex}
            />
            currentIndex = currentIndex + rowCount;
            return rowView

        })
    };

    return (
        <>
            {getElements()}
        </>
       
    )
};

export default ComposableContainer



