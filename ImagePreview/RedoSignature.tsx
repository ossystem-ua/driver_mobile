import { BaseButton } from '@/Components'
import { useTheme } from '@/Theme'
import React from 'react'
import { View } from 'react-native'
import Pdf from 'react-native-pdf'
import { useSelector } from 'react-redux'
import { modalKinds } from '@/Config'
import { useOnScanComplete } from '@/Services/Hooks'
import {
  selectActiveTripDocumentFileToUpload,
  selectActiveTripUploadDocumentFile,
} from '@/Store/ActiveTrip'

const RedoSignature = ({
  pdf,
  setShowCroppedLayout,
  setPdf,
  setRedoPdf,
  redoPdf,
}: {
  pdf: string
  setShowCroppedLayout: React.Dispatch<React.SetStateAction<number>>
  setPdf: React.Dispatch<React.SetStateAction<string | null>>
  setRedoPdf: React.Dispatch<React.SetStateAction<string | null>>
  redoPdf: string | null
}) => {
  const { Layout, Gutters, Colors } = useTheme()
  const { uploadId } = useSelector(selectActiveTripDocumentFileToUpload) || {}
  const uploadDocumentFileState = useSelector(
    selectActiveTripUploadDocumentFile,
  )

  const { loading = false, error = null } = uploadId
    ? uploadDocumentFileState[uploadId] || {}
    : {}

  useOnScanComplete({
    loading: loading,
    error: error,
  })

  const onRedoPdf = () => {
    setPdf(redoPdf!)
    setShowCroppedLayout(6)
  }

  const onSavePdf = () => {
    setRedoPdf(pdf)
    setShowCroppedLayout(5)
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
      <Pdf
        source={{ uri: `file://${pdf}` }}
        minScale={1.0}
        maxScale={1.0}
        scale={1.0}
        spacing={0}
        fitPolicy={2}
        enablePaging={true}
        //   activityIndicatorProps={{ color: Colors.primary }}
        onLoadComplete={(numberOfPages, filePath) => {
          // setFilePath(filePath)
        }}
        onError={() => {
          // setPreviewError(true)
        }}
        style={{
          // ...Layout.fill,
          flex: 1,
          backgroundColor: 'transparent',
        }}
      />
      <View style={[Layout.fullWidth, Layout.row, Gutters.scale160VPadding]}>
        <BaseButton
          onPress={onRedoPdf}
          style={{
            ...Gutters.scale180RMargin,
            backgroundColor: Colors.modalDeclineButton,
          }}
          textStyle={{ color: Colors.buttonText }}
          label={'Redo signature'}
        />
        <BaseButton onPress={onSavePdf} label={'Save'} />
      </View>
    </View>
  )
}

export default RedoSignature
