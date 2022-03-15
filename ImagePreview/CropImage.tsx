import CustomCrop from '@/../modules/react-native-perspective-image-cropper'
import { isIOS } from '@/Services/Helpers'
import { useTheme } from '@/Theme'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Image, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const CropImage = ({
  image,
  rectangle,
  rectangleCoords,
  setRectangleCoords,
  setCroppedImage,
  setShowCroppedLayout,
  setCurrentLayout,
}) => {
  const ref = useRef()

  const [initialLoading, setInitialLoading] = useState(true)
  const [imageSizes, setImageSizes] = useState({
    width: 200,
    height: 200,
  })
  const { Layout, Gutters, Colors, MetricsSizes } = useTheme()

  const adjustCoords = ({ x, y }: { x: number; y: number }, ratio: number) => {
    return { x: x + 5 * ratio, y: y + 18 * ratio }
  }

  const adjustIOsCoors = (
    { x, y }: { x: number; y: number },
    xRatio: number,
    yRatio: number,
  ) => {
    return { x: x * xRatio, y: y * yRatio }
  }

  useEffect(() => {
    setInitialLoading(true)
    Image.getSize(image, (width, height) => {
      setImageSizes({ width, height })
      if (rectangle && !rectangleCoords) {
        let windowWidth = Dimensions.get('window').width
        let ratio = width / windowWidth
        const { topLeft, topRight, bottomRight, bottomLeft, dimensions } =
          rectangle
        const { width: recWidth, height: recHeight } = dimensions
        const xRatio = width / recWidth
        const yRatio = height / recHeight

        setRectangleCoords(
          isIOS
            ? {
              topLeft: adjustIOsCoors(topLeft, xRatio, yRatio),
              topRight: adjustIOsCoors(bottomLeft, xRatio, yRatio),
              bottomRight: adjustIOsCoors(bottomRight, xRatio, yRatio),
              bottomLeft: adjustIOsCoors(topRight, xRatio, yRatio),
            }
            : {
              topLeft: adjustCoords(topRight, ratio),
              topRight: adjustCoords(bottomRight, ratio),
              bottomRight: adjustCoords(bottomLeft, ratio),
              bottomLeft: adjustCoords(topLeft, ratio),
            },
        )
      }
      setInitialLoading(false)
    }),
      (error: any) => {
        console.log(error)
        setInitialLoading(false)
      }
  }, [])

  const updateImage = (image, newCoordinates) => {
    setCroppedImage(`data:image/png;base64,${image}`)
    setRectangleCoords(newCoordinates)
    setShowCroppedLayout(2)
  }

  const saveImage = image

  const crop = () => {
    console.log(ref.current)
    ref.current?.crop()
  }

  return !initialLoading ? (
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
        <CustomCrop
          updateImage={updateImage}
          rectangleCoordinates={rectangleCoords}
          initialImage={image}
          height={imageSizes.height}
          width={imageSizes.width}
          ref={ref}
          overlayColor="#0083EC"
          overlayStrokeColor="#0083EC"
          handlerColor="#0083EC"
          enablePanStrict={true}
        />
      </View>
      <View
        style={[
          Layout.row,
          Layout.justifyContentCenter,
          Gutters.scale200TPadding,
        ]}
      >
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            height: 50,
            width: 50,
            borderRadius: 50,
            ...Layout.center,
            ...Gutters.scale200HMargin,
            ...Gutters.scale200RMargin,
          }}
          onPress={() => setCurrentLayout(1)}
        >
          <Icon
            name="camera-reverse"
            style={{
              fontSize: Number(MetricsSizes.scale280),
              color: Colors.white,
              textAlign: 'center',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            height: 50,
            width: 50,
            borderRadius: 50,
            ...Layout.center,
            ...Gutters.scale200HMargin,
            ...Gutters.scale200RMargin,
          }}
          onPress={crop}
        >
          <Icon
            name="crop-outline"
            style={{
              fontSize: Number(MetricsSizes.scale280),
              color: Colors.white,
              textAlign: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View
      style={{
        ...Layout.fill,
        ...Layout.justifyContentCenter,
        backgroundColor: Colors.backgroundMainColor,
      }}
    />
  )
}

export default CropImage
