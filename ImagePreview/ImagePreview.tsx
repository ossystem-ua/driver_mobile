import { useTheme } from '@/Theme'
import React, { useState } from 'react'
import { View } from 'react-native'
import AddSignature from './AddSignature'
import ConvertToPdf from './ConvertToPdf'
import CropImage from './CropImage'
import FilterImage from './FilterImage'
import PdfPreview from './PdfPreview'
import RedoSignature from './RedoSignature'
import ResultCropImage from './ResultCropImage'

type Coords = {
  x: number
  y: number
}

type ImagePreviewProps = {
  uri: string
  rectangle: {
    topLeft: Coords
    topRight: Coords
    bottomRight: Coords
    bottomLeft: Coords
    dimensions: {
      width: number
      height: number
    }
  }
  setCurrentLayout: React.Dispatch<React.SetStateAction<number>>
  navigatedFromCurrentTrip: boolean
}

// const { topLeft, topRight, bottomRight, Coords, dimensions } = rectangle

const scanSteps = {
  CROP_ORIGINAL_IMAGE: 1,
  SHOW_CROPPED_IMAGE: 2,
  APPLY_FILTER_TO_CROPPED_IMAGE: 3,
  CONVERT_TO_PDF: 4,
  PREVIEW_PDF: 5,
  SIGN_PDF: 6,
  REDO_SIGNATURE: 7,
}

const ImagePreview = ({
  uri,
  rectangle,
  setCurrentLayout,
  navigatedFromCurrentTrip,
}: ImagePreviewProps) => {
  const [image, setImage] = useState<string>(uri)
  const [rectangleCoords, setRectangleCoords] = useState(null)
  const [pdf, setPdf] = useState<string | null>(null)
  const [redoPdf, setRedoPdf] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [pdfSize, setPdfSize] = useState<number | null>(null)
  const [showCroppedLayout, setShowCroppedLayout] = useState<number>(
    scanSteps.CROP_ORIGINAL_IMAGE,
  )
  const { Layout, Gutters, Colors } = useTheme()

  return (
    <View
      style={{
        ...Layout.justifyContentBetween,
        ...Layout.fill,
        ...Gutters.scale100VPadding,
        backgroundColor: Colors.backgroundMainColor,
      }}
    >
      {showCroppedLayout === scanSteps.SHOW_CROPPED_IMAGE && (
        <ResultCropImage
          croppedImage={croppedImage!}
          setShowCroppedLayout={setShowCroppedLayout}
          setCroppedImage={setCroppedImage}
        />
      )}
      {showCroppedLayout === scanSteps.CROP_ORIGINAL_IMAGE && (
        <CropImage
          image={image}
          rectangle={rectangle}
          // setImage={setImage}
          setCurrentLayout={setCurrentLayout}
          rectangleCoords={rectangleCoords}
          setRectangleCoords={setRectangleCoords}
          setCroppedImage={setCroppedImage}
          setShowCroppedLayout={setShowCroppedLayout}
        />
      )}
      {showCroppedLayout === scanSteps.APPLY_FILTER_TO_CROPPED_IMAGE && (
        <FilterImage
          croppedImage={croppedImage!}
          setCroppedImage={setCroppedImage}
          setShowCroppedLayout={setShowCroppedLayout}
        />
      )}
      {showCroppedLayout === scanSteps.CONVERT_TO_PDF && (
        <ConvertToPdf
          croppedImage={croppedImage!}
          setPdf={setPdf}
          setRedoPdf={setRedoPdf}
          setShowCroppedLayout={setShowCroppedLayout}
          setCurrentLayout={setCurrentLayout}
        />
      )}
      {showCroppedLayout === scanSteps.PREVIEW_PDF && (
        <PdfPreview
          pdf={pdf!}
          setShowCroppedLayout={setShowCroppedLayout}
          pdfSize={pdfSize}
          setPdfSize={setPdfSize}
          navigatedFromCurrentTrip={navigatedFromCurrentTrip}
        />
      )}
      {showCroppedLayout === scanSteps.SIGN_PDF && (
        <AddSignature
          pdf={pdf!}
          setPdf={setPdf}
          setShowCroppedLayout={setShowCroppedLayout}
        />
      )}
      {showCroppedLayout === scanSteps.REDO_SIGNATURE && (
        <RedoSignature
          pdf={pdf!}
          setShowCroppedLayout={setShowCroppedLayout}
          setPdf={setPdf}
          redoPdf={redoPdf}
          setRedoPdf={setRedoPdf}
        />
      )}
    </View>
  )
}

export default ImagePreview
