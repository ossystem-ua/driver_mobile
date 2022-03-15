import React, { useState } from 'react'
import {
  Dimensions,
  Image,
  Text,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import RNImageToPdf from 'react-native-image-to-pdf'
import { selectScannedImages } from '@/Store/ActiveTrip'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Theme'

const ConvertToPdf = ({
  setShowCroppedLayout,
  croppedImage,
  setPdf,
  setCurrentLayout,
  setRedoPdf,
}: {
  setRedoPdf: React.Dispatch<React.SetStateAction<string | null>>
  setPdf: React.Dispatch<React.SetStateAction<string | null>>
  setShowCroppedLayout: React.Dispatch<React.SetStateAction<number>>
  setCurrentLayout: React.Dispatch<React.SetStateAction<number>>
  croppedImage: string
}) => {
  const { imagesData } = useSelector(selectScannedImages)
  const [loading, pdfLoading] = useState(false)
  const { Layout, Colors, Gutters, Common, MetricsSizes, Fonts } = useTheme()

  const convertedImageArray = imagesData.map((image: string) =>
    image.replace('file://', ''),
  )

  const dimensions = Dimensions.get('window')
  console.log('dimensions', dimensions)

  const myAsyncPDFFunction = async () => {
    if (!imagesData.length) {
      return
    }
    try {
      pdfLoading(true)
      const options = {
        imagePaths: convertedImageArray,
        name: 'PDFName',
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 900,
          height: Math.round((297 / 210) * 900),
        },
        quality: 1, // optional compression paramter
      }
      const pdf = await RNImageToPdf.createPDFbyImages(options)
      pdfLoading(false)
      setPdf(pdf.filePath)
      setRedoPdf(pdf.filePath)
      setShowCroppedLayout(5)
      console.log(pdf.filePath)
    } catch (e) {
      console.log(e)
      pdfLoading(false)
    }
  }

  return (
    <View
      style={{
        ...Layout.justifyContentBetween,
        ...Layout.fill,
        backgroundColor: Colors.backgroundMainColor,
        ...Gutters.scale200HPadding,
      }}
    >
      <View style={[Layout.fill, Layout.center]}>
        <Image
          style={[Layout.selfCenter, Layout.fullSize]}
          resizeMode="contain"
          source={{ uri: croppedImage }}
        />
      </View>
      <View style={[Layout.fullWidth, Layout.column, Gutters.scale200TMargin]}>
        <Pressable
          style={[
            Common.button.outlineRounded,
            Layout.rowHCenter,
            Gutters.scale160RMargin,
            {
              padding: MetricsSizes.scale100,
              height: 'auto',
              backgroundColor: Colors.outlinedRoundedButton,
              flexShrink: 0,
            },
          ]}
          onPress={() => setCurrentLayout(1)}
          disabled={loading}
        >
          <Icon
            name="add-circle-outline"
            style={[
              {
                fontSize: Number(MetricsSizes.scale280),
                color: Colors.primary,
                ...Gutters.scale80RMargin,
              },
            ]}
          />
          <Text style={[Fonts.labelLightBoldMedium, { color: Colors.primary }]}>
            {/* {t('actions.documentsScan')}  */}
            Take another picture
          </Text>
        </Pressable>
        <Pressable
          style={[
            Common.button.outlineRounded,
            Layout.rowHCenter,
            Gutters.scale160RMargin,
            Gutters.scale100TMargin,
            {
              padding: MetricsSizes.scale100,
              height: 'auto',
              backgroundColor: Colors.outlinedRoundedButton,
              flexShrink: 0,
            },
          ]}
          onPress={myAsyncPDFFunction}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <>
              <Icon
                name="document-text-outline"
                style={[
                  {
                    fontSize: Number(MetricsSizes.scale280),
                    color: Colors.primary,
                    ...Gutters.scale80RMargin,
                  },
                ]}
              />
              <Text
                style={[Fonts.labelLightBoldMedium, { color: Colors.primary }]}
              >
                {/* {t('actions.documentsScan')}  */}
                Convert to pdf
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  )
}

export default ConvertToPdf
