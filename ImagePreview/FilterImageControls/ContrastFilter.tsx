import { usePrevious } from '@/Services/Hooks'
import { useTheme } from '@/Theme'
import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'react-native'
import { Brightness, Contrast } from 'react-native-image-filter-kit'

const ContrastFilter = ({
  setUpdatedImage,
  contrastValue,
  updatedImage,
  setSavingInProgress,
  setFilteringImage,
  setValue,
}) => {
  const [filteredImage, setFilteredImage] = useState()
  const prevContrastValue = usePrevious(contrastValue)
  const { Layout } = useTheme()

  useEffect(() => {
    setValue(1)
    setFilteredImage(updatedImage)
  }, [])

  useEffect(() => {
    if (prevContrastValue !== contrastValue) {
      setSavingInProgress(true)
    }
  }, [contrastValue])

  return (
    <Contrast
      amount={contrastValue}
      style={[Layout.selfCenter, Layout.fullSize]}
      onFilteringError={({ nativeEvent }) =>
        console.log('err', nativeEvent.message)
      }
      onExtractImage={({ nativeEvent }) => {
        console.log('uri', nativeEvent.uri)
        setFilteringImage(nativeEvent.uri)
        console.log('saved')
        setSavingInProgress(false)
      }}
      extractImageEnabled={true}
      image={
        <Image
          style={[Layout.selfCenter, Layout.fullSize]}
          source={{ uri: filteredImage }}
          resizeMode="contain"
        />
      }
    />
  )
}

export default ContrastFilter
