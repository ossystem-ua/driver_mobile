import { BaseButton } from '@/Components'
import { useTheme } from '@/Theme'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Pdf from 'react-native-pdf'
import ChangeTripDocumentFileModule from '@/Store/ActiveTrip/ChangeTripDocumentFile'
import ChangeModal from '@/Store/App/ChangeModal'
import { batch, useDispatch, useSelector } from 'react-redux'
import { modalKinds } from '@/Config'
import { useLinkTo } from '@react-navigation/native'
import { useOnScanComplete } from '@/Services/Hooks'
import {
  selectActiveTripDocumentFileToUpload,
  selectActiveTripUploadDocumentFile,
} from '@/Store/ActiveTrip'
import RNFetchBlob from 'rn-fetch-blob'

const { UPLOAD_DOCUMENT_INFO } = modalKinds

const PdfPreview = ({
  pdf,
  pdfSize,
  setShowCroppedLayout,
  setPdfSize,
  navigatedFromCurrentTrip,
}: {
  pdf: string
  pdfSize: number | null
  setShowCroppedLayout: React.Dispatch<React.SetStateAction<number>>
  setPdfSize: React.Dispatch<React.SetStateAction<number | null>>
  navigatedFromCurrentTrip: boolean
}) => {
  const { Layout, Gutters, Colors } = useTheme()
  const dispatch = useDispatch()
  const linkTo = useLinkTo()
  const { uploadId } = useSelector(selectActiveTripDocumentFileToUpload) || {}
  const uploadDocumentFileState = useSelector(
    selectActiveTripUploadDocumentFile,
  )

  useEffect(() => {
    RNFetchBlob.fs
      .stat(pdf)
      .then(data => {
        setPdfSize(data.size)
      })
      .catch(error => {
        console.log('err', error)
      })
  }, [])

  const { loading = false, error = null } = uploadId
    ? uploadDocumentFileState[uploadId] || {}
    : {}

  useOnScanComplete({
    loading: loading,
    error: error,
    navigatedFromCurrentTrip: navigatedFromCurrentTrip,
  })

  const uploadPdf = () => {
    batch(() => {
      dispatch(
        ChangeTripDocumentFileModule.action({
          uploadId: `${Date.now()}_${Math.random()}`,
          fileName: `Pdf_Document_${Date.now()}.pdf`,
          fileUri: `file://${pdf}`,
          fileType: 'application/pdf',
          fileSize: pdfSize,
        }),
      )
      dispatch(ChangeModal.action({ modalKind: UPLOAD_DOCUMENT_INFO }))
      linkTo('/Modal')
    })
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
          onPress={uploadPdf}
          style={{
            ...Gutters.scale180RMargin,
            backgroundColor: Colors.modalDeclineButton,
          }}
          textStyle={{ color: Colors.buttonText }}
          label={'Upload'}
        />
        <BaseButton
          onPress={() => setShowCroppedLayout(6)}
          label={'Add signature'}
        />
      </View>
    </View>
  )
}

export default PdfPreview
