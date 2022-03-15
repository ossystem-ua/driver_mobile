import { useTheme } from '@/Theme'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { _1977 } from 'react-native-image-filter-kit'
import Icon from 'react-native-vector-icons/Ionicons'

const ResultCropImage = ({
  setShowCroppedLayout,
  croppedImage,
  setCroppedImage,
}: {
  setShowCroppedLayout: React.Dispatch<React.SetStateAction<number>>
  croppedImage: string
  setCroppedImage: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  const { Layout, Gutters, Colors, MetricsSizes } = useTheme()
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
        <Image
          style={[Layout.selfCenter, Layout.fullSize]}
          resizeMode="contain"
          source={{ uri: croppedImage }}
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
          onPress={() => setShowCroppedLayout(1)}
        >
          <Icon
            name="arrow-undo-outline"
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
          onPress={() => setShowCroppedLayout(3)}
        >
          <Icon
            name="checkmark-sharp"
            style={{
              fontSize: Number(MetricsSizes.scale280),
              color: Colors.white,
              textAlign: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ResultCropImage
