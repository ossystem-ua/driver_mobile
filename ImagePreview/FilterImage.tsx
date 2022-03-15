import AddScannedImages from '@/Store/ActiveTrip/AddScannedImages'
import { useTheme } from '@/Theme'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, View } from 'react-native'
import {
  cleanExtractedImagesCache,
  Normal,
} from 'react-native-image-filter-kit'
import { useDispatch } from 'react-redux'
import FilterImageControls, {
  BrigtnessFilter,
  ContrastFilter,
  GrayscaleFilter,
} from './FilterImageControls'

type FilterImageProps = {
  croppedImage: string
  setCroppedImage: React.Dispatch<any>
  setShowCroppedLayout: React.Dispatch<any>
}

const filterTypes = {
  DEFAULT_IMAGE: 0,
  GRAYSCALE: 1,
  BRIGHTNESS: 2,
  CONTRAST: 3,
}

const DEFAULT_BRIGHTNESS = 1
const DEFAULT_CONTRAST = 1
const DEFAULT_GRAYSCALE = 1

const FilterImage = ({
  croppedImage,
  setCroppedImage,
  setShowCroppedLayout,
}: FilterImageProps) => {
  const [initialImage, setInitialImage] = useState(croppedImage)
  const [updatedImage, setUpdatedImage] = useState(croppedImage)
  const [filteringImage, setFilteringImage] = useState(croppedImage)
  const [currentFilter, setCurrentFilter] = useState(0)
  const [brightnessValue, setBrigtnessValue] = useState(DEFAULT_BRIGHTNESS)
  const [contrastValue, setContrastValue] = useState(DEFAULT_CONTRAST)
  const [grayscaleValue, setGrayscaleValue] = useState(DEFAULT_GRAYSCALE)
  const [savingInProgress, setSavingInProgress] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [initialExtract, setInitialExtract] = useState(true)
  const dispatch = useDispatch()
  const { Layout, Gutters, Colors } = useTheme()
  const loading = initialLoading || savingInProgress

  const filterProps = (currentFilter: number) => {
    if (currentFilter === filterTypes.GRAYSCALE) {
      return {
        initialValue: DEFAULT_GRAYSCALE,
        value: grayscaleValue,
        setValue: setGrayscaleValue,
        min: 0,
        max: 1,
        step: 0.01,
        sliderLength: 250,
      }
    }
    if (currentFilter === filterTypes.BRIGHTNESS) {
      return {
        initialValue: DEFAULT_BRIGHTNESS,
        value: brightnessValue,
        setValue: setBrigtnessValue,
        min: 0,
        max: 2,
        step: 0.05,
        sliderLength: 250,
      }
    }
    if (currentFilter === filterTypes.CONTRAST) {
      return {
        initialValue: DEFAULT_CONTRAST,
        value: contrastValue,
        setValue: setContrastValue,
        min: -10,
        max: 10,
        step: 0.25,
        sliderLength: 250,
      }
    }
  }

  const applyFilter = () => {
    setUpdatedImage(filteringImage)
    setCurrentFilter(filterTypes.DEFAULT_IMAGE)
  }

  const saveImage = () => {
    dispatch(AddScannedImages.action(updatedImage))
    setCroppedImage(updatedImage)
    setShowCroppedLayout(4)
  }

  return (
    <View
      style={{
        ...Layout.fill,
        ...Layout.justifyContentCenter,
        ...Gutters.scale100VPadding,
        backgroundColor: Colors.backgroundMainColor,
      }}
    >
      <View
        style={{
          ...Layout.fill,
          ...Layout.justifyContentCenter,
        }}
      >
        {currentFilter === filterTypes.DEFAULT_IMAGE && (
          <View
            style={{
              ...Layout.fill,
              ...Layout.justifyContentCenter,
              ...Layout.relative,
            }}
          >
            {initialLoading && (
              <View
                style={{
                  ...Layout.fill,
                  ...Layout.justifyContentCenter,
                  ...Layout.absolute,
                  ...Layout.fullSize,
                  zIndex: 9,
                  backgroundColor: Colors.backgroundMainColor,
                }}
              >
                <ActivityIndicator
                  size="large"
                  color={Colors.primary}
                  style={{
                    zIndex: 10,
                    ...Layout.selfCenter,
                  }}
                />
              </View>
            )}
            <Normal
              style={[Layout.selfCenter, Layout.fullSize]}
              onFilteringError={({ nativeEvent }) =>
                console.log('err', nativeEvent.message)
              }
              onExtractImage={({ nativeEvent }) => {
                console.log('uri', nativeEvent.uri)
                setUpdatedImage(nativeEvent.uri)
                setInitialLoading(false)
                setInitialExtract(false)
              }}
              extractImageEnabled={initialExtract}
              image={
                <Image
                  style={[Layout.selfCenter, Layout.fullSize]}
                  source={{ uri: updatedImage }}
                  resizeMode="contain"
                />
              }
            />
          </View>
        )}
        {currentFilter === filterTypes.GRAYSCALE && (
          <GrayscaleFilter
            setValue={setGrayscaleValue}
            setUpdatedImage={setUpdatedImage}
            setFilteringImage={setFilteringImage}
            grayScaleValue={grayscaleValue}
            updatedImage={updatedImage}
            setSavingInProgress={setSavingInProgress}
          />
        )}
        {currentFilter === filterTypes.BRIGHTNESS && (
          <BrigtnessFilter
            setValue={setBrigtnessValue}
            setUpdatedImage={setUpdatedImage}
            setFilteringImage={setFilteringImage}
            brightnessValue={brightnessValue}
            updatedImage={updatedImage}
            setSavingInProgress={setSavingInProgress}
          />
        )}
        {currentFilter === filterTypes.CONTRAST && (
          <ContrastFilter
            setValue={setContrastValue}
            setUpdatedImage={setUpdatedImage}
            setFilteringImage={setFilteringImage}
            contrastValue={contrastValue}
            updatedImage={updatedImage}
            setSavingInProgress={setSavingInProgress}
          />
        )}
      </View>
      <FilterImageControls
        applyFilter={applyFilter}
        savingInProgress={loading}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        filterProps={filterProps(currentFilter)}
        saveImage={saveImage}
      />
    </View>
  )
}

export default FilterImage
