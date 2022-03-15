import { usePrevious } from '@/Services/Hooks'
import { useTheme } from '@/Theme'
import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'react-native'
import { Brightness, Grayscale } from 'react-native-image-filter-kit'

const GrayscaleFilter = ({
  setUpdatedImage,
  grayscaleValue,
  updatedImage,
  setSavingInProgress,
  setFilteringImage,
  setValue,
}) => {
  const [filteredImage, setFilteredImage] = useState()
  const prevContrastValue = usePrevious(grayscaleValue)
  const { Layout } = useTheme()

  useEffect(() => {
    setFilteredImage(updatedImage)
    setValue(0)
  }, [])

  useEffect(() => {
    if (prevContrastValue !== grayscaleValue) {
      setSavingInProgress(true)
    }
  }, [grayscaleValue])

  return (
    <Grayscale
      amount={grayscaleValue}
      style={[Layout.selfCenter, Layout.fullSize]}
      onFilteringError={({ nativeEvent }) =>
        console.log('err', nativeEvent.message)
      }
      onExtractImage={({ nativeEvent }) => {
        console.log('uri', nativeEvent.uri)
        setFilteringImage(nativeEvent.uri)
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

export default GrayscaleFilter
