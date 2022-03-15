import MultiSlider from '@ptomasroos/react-native-multi-slider'
import React, { useEffect } from 'react'

const FilterSlider = ({ value, setValue, min, max, step, sliderLength }) => {
  return (
    <MultiSlider
      values={[value]}
      containerStyle={{ alignSelf: 'center' }}
      trackStyle={{ height: 4, backgroundColor: '#FFF' }}
      selectedStyle={{ backgroundColor: '#0083EC' }}
      unselectedStyle={{ backgroundColor: '#FFF' }}
      markerStyle={{ width: 25, height: 25, backgroundColor: '#0083EC' }}
      sliderLength={sliderLength}
      onValuesChangeFinish={values => {
        setValue(values[0])
      }}
      min={min}
      max={max}
      step={step}
      // snapped
      isMarkersSeparated
    />
  )
}

export default FilterSlider
