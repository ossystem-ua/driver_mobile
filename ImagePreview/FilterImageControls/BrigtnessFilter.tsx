import { usePrevious } from '@/Services/Hooks'
import { useTheme } from '@/Theme'
import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'react-native'
import { Brightness } from 'react-native-image-filter-kit'

const BrigtnessFilter = ({
  setUpdatedImage,
  brightnessValue,
  updatedImage,
  setSavingInProgress,
  setFilteringImage,
  setValue,
}) => {
  const [filteredImage, setFilteredImage] = useState()
  const prevContrastValue = usePrevious(brightnessValue)
  const { Layout } = useTheme()

  useEffect(() => {
    setFilteredImage(updatedImage)
    setValue(1)
  }, [])

  useEffect(() => {
    if (prevContrastValue !== brightnessValue) {
      setSavingInProgress(true)
    }
  }, [brightnessValue])

  return (
    <Brightness
      amount={brightnessValue}
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

export default BrigtnessFilter
